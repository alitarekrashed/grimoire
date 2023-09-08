import { Feat } from '@/models/db/feat'
import { Feature } from '@/models/db/feature'
import { SourcedFeature } from '@/models/player-character'
import { cloneDeep } from 'lodash'

interface FeatWithContext {
  context: string[] | undefined
  feat: Feat
}

export class FeatManager {
  private constructor(
    private resolvedFeats: SourcedFeature[],
    private featNames: string[],
    private featModifications: Map<string, { name: string; value: string }[]>
  ) {}

  public getResolvedFeats(): SourcedFeature[] {
    return this.resolvedFeats
  }

  public getFeatNames(): string[] {
    return this.featNames
  }

  public getModifications(feat: string): { name: string; value: string }[] {
    return this.featModifications.get(feat) ?? []
  }

  static async build(feats: Feature[]) {
    const resolved = await resolveFeats(feats)
    const featNames: string[] = resolved.map(
      (sourced: SourcedFeature) => sourced.source
    )
    const modifications: Map<string, { name: string; value: string }[]> =
      new Map()

    resolved.forEach((sourced: SourcedFeature) => {
      const feature = sourced.feature
      if (feature.type === 'ACTION_MODIFIER') {
        if (!modifications.has(feature.value.name.toLowerCase())) {
          modifications.set(feature.value.name.toLowerCase(), [
            { name: sourced.source, value: feature.value.description },
          ])
        } else {
          modifications
            .get(feature.value.name.toLowerCase())!
            .push({ name: sourced.source, value: feature.value.description })
        }
      }
    })

    return new FeatManager(resolved, featNames, modifications)
  }
}

async function resolveFeats(feats: Feature[]): Promise<SourcedFeature[]> {
  let resolvedFeatures: SourcedFeature[] = []
  const resolvedFeats: {
    context: string[] | undefined
    feat: Feat
  }[] = await Promise.all(
    feats.filter((feat) => feat?.value).map((feat) => getAndConvertFeat(feat))
  )

  let additionalFeats: Feature[] = []
  resolvedFeats
    .filter((val) => val)
    .forEach((featWithContext: FeatWithContext) => {
      resolvedFeatures.push(
        ...featWithContext.feat.features
          .filter((feature) => !feature.value.action)
          .filter((feature) => feature.type !== 'FEAT')
          .map((feature: Feature) => {
            let modifiedFeature = cloneDeep(feature)
            if (
              feature.type === 'MISC' &&
              featWithContext.context &&
              feature.value.description
            ) {
              featWithContext.context.forEach((val, index) => {
                modifiedFeature.value.description =
                  modifiedFeature.value.description.replaceAll(
                    `{${index}}`,
                    val
                  )
              })
              modifiedFeature.context = featWithContext.context
            }

            if (
              feature.type === 'SPELL' &&
              featWithContext.context &&
              featWithContext.context.length === 1 &&
              feature.context &&
              feature.context.length === 1
            ) {
              modifiedFeature.value.name =
                modifiedFeature.value.name.replaceAll(
                  '{0}',
                  featWithContext.context[0]
                )
              modifiedFeature.context = featWithContext.context
            }

            if (
              feature.type === 'PROFICIENCY_DOWNGRADE' &&
              featWithContext.context &&
              featWithContext.context.length === 1 &&
              feature.context &&
              feature.context.length === 1 &&
              feature.value.group
            ) {
              modifiedFeature.value.group =
                modifiedFeature.value.group.replaceAll(
                  '{0}',
                  featWithContext.context[0]
                )
              modifiedFeature.context = featWithContext.context
            }

            return {
              source: featWithContext.feat.name,
              feature: modifiedFeature,
            }
          })
      )
      if (featWithContext.feat.activation) {
        resolvedFeatures.push({
          source: featWithContext.feat.name,
          feature: { type: 'ACTION', value: featWithContext.feat },
        })
      }
      additionalFeats.push(
        ...featWithContext.feat.features.filter(
          (feature) => feature.type === 'FEAT'
        )
      )
    })

  if (additionalFeats.length > 0) {
    resolvedFeatures.push(...(await resolveFeats(additionalFeats)))
  }

  return resolvedFeatures
}

async function getAndConvertFeat(feature: Feature): Promise<FeatWithContext> {
  const feats = (await getFeat(feature.value)) as Feat[]
  const feat = feats.length > 0 ? feats[0] : undefined!
  return { context: feature.context, feat: feat }
}

async function getFeat(name: string) {
  return name
    ? await (
        await fetch(`http://localhost:3000/api/feats?name=${name}`, {
          cache: 'no-store',
        })
      ).json()
    : undefined
}
