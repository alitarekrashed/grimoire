export class ProficiencyRank {
  static UNTRAINED: ProficiencyRank = new ProficiencyRank('untrained', 0)
  static TRAINED: ProficiencyRank = new ProficiencyRank('trained', 2)
  static EXPERT: ProficiencyRank = new ProficiencyRank('expert', 4)
  static MASTER: ProficiencyRank = new ProficiencyRank('master', 6)
  static LEGENDARY: ProficiencyRank = new ProficiencyRank('legendary', 8)

  private constructor(
    private rank: string,
    private value: number
  ) {}

  public getName(): string {
    return this.rank
  }

  public getValue(): number {
    return this.value
  }

  public getNext(): ProficiencyRank {
    switch (this.rank) {
      case 'untrained': {
        return ProficiencyRank.TRAINED
      }
      case 'trained': {
        return ProficiencyRank.EXPERT
      }
      case 'expert': {
        return ProficiencyRank.MASTER
      }
      case 'master': {
        return ProficiencyRank.LEGENDARY
      }
      default:
        return this
    }
  }

  static get(name: string): ProficiencyRank {
    switch (name) {
      case 'trained':
        return this.TRAINED
      case 'expert':
        return this.EXPERT
      case 'master':
        return this.MASTER
      case 'legendary':
        return this.LEGENDARY
      default:
        return this.UNTRAINED
    }
  }

  static isLessThanOrEqualTo(value: ProficiencyRank, other: ProficiencyRank) {
    return value.value <= other.value
  }

  static isGreaterThanOrEqualTo(
    value: ProficiencyRank,
    other: ProficiencyRank
  ) {
    return value.value >= other.value
  }

  static getGreaterThan(value: ProficiencyRank, other: ProficiencyRank) {
    if (value.value >= other.value) {
      return value
    }
    return other
  }
}
