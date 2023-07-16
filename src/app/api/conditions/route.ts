import Condition from '@/models/condition'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json(allConditions)
}

const allConditions: Condition[] = [
  {
    id: 'blinded',
    name: 'blinded',
    description:
      "You can't see. All normal terrain is difficult terrain to you. You can't detect anything using vision. You automatically critically fail Perception checks that require you to be able to see, and if vision is your only precise sense, you take a –4 status penalty to Perception checks. You are immune to visual effects. Blinded overrides @condition:dazzled@.",
    source: [
      {
        title: 'Core Rulebook',
        page: '618',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'broken',
    name: 'broken',
    description:
      "<p>Broken is a condition that affects objects. An object is broken when damage has reduced its Hit Points to equal or less than its Broken Threshold. A broken object can't be used for its normal function, nor does it grant bonuses&mdash; with the exception of armor. Broken armor still grants its item bonus to AC, but it also imparts a status penalty to AC depending on its category: &ndash;1 for broken light armor, &ndash;2 for broken medium armor, or &ndash;3 for broken heavy armor.</p><br/><p>A broken item still imposes penalties and limitations normally incurred by carrying, holding, or wearing it. For example, broken armor would still impose its Dexterity modifier cap, check penalty, and so forth.</p><br/><p>If an effect makes an item broken automatically and the item has more HP than its Broken Threshold, that effect also reduces the item's current HP to the Broken Threshold.</p>",
    source: [
      {
        title: 'Core Rulebook',
        page: '618',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'clumsy',
    name: 'clumsy',
    description:
      'Your movements become clumsy and inexact. Clumsy always includes a value. You take a status penalty equal to the condition value to Dexterity-based checks and DCs, including AC, Reflex saves, ranged attack rolls, and skill checks using Acrobatics, Stealth, and Thievery.',
    source: [
      {
        title: 'Core Rulebook',
        page: '618',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'concealed',
    name: 'concealed',
    description:
      "While you are concealed from a creature, such as in a thick fog, you are difficult for that creature to see. You can still be @condition:observed@, but you're tougher to target. A creature that you're concealed from must succeed at a DC 5 flat check when targeting you with an attack, spell, or other effect. Area effects aren't subject to this flat check. If the check fails, the attack, spell, or effect doesn't affect you.",
    source: [
      {
        title: 'Core Rulebook',
        page: '618',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'confused',
    name: 'confused',
    description:
      "You don't have your wits about you, and you attack wildly. You are @condition:off-guard@, you don't treat anyone as your ally (though they might still treat you as theirs), and you can't Delay, Ready, or use reactions.<br/><br/> You use all your actions to Strike or cast offensive cantrips, though the GM can have you use other actions to facilitate attack, such as draw a weapon, move so that a target is in reach, and so forth. Your targets are determined randomly by the GM. If you have no other viable targets, you target yourself, automatically hitting but not scoring a critical hit. If it's impossible for you to attack or cast spells, you babble incoherently, wasting your actions.<br/><br/> Each time you take damage from an attack or spell, you can attempt a DC 11 flat check to recover from your confusion and end the condition.",
    source: [
      {
        title: 'Core Rulebook',
        page: '618',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'controlled',
    name: 'controlled',
    description:
      "Someone else is making your decisions for you, usually because you're being commanded or magically dominated. The controller dictates how you act and can make you use any of your actions, including attacks, reactions, or even Delay. The controller usually does not have to spend their own actions when controlling you.",
    source: [
      {
        title: 'Core Rulebook',
        page: '618',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'dazzled',
    name: 'dazzled',
    description:
      'Your eyes are overstimulated. If vision is your only precise sense, all creatures and objects are @condition:concealed@ from you.',
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'deafened',
    name: 'deafened',
    description:
      "You can't hear. You automatically critically fail Perception checks that require you to be able to hear. You take a –2 status penalty to Perception checks for initiative and checks that involve sound but also rely on other senses. If you perform an action with the @trait:auditory@ trait, you must succeed at a DC 5 flat check or the action is lost; attempt the check after spending the action but before any effects are applied. You are immune to auditory effects.",
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'doomed',
    name: 'doomed',
    description:
      "A powerful force has gripped your soul, calling you closer to death. Doomed always includes a value. The dying value at which you die is reduced by your doomed value. If your maximum dying value is reduced to 0, you instantly die. When you die, you're no longer doomed.<br/><br/> Your doomed value decreases by 1 each time you get a full night's rest.",
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'drained',
    name: 'drained',
    description:
      'When a creature successfully drains you of blood or life force, you become less healthy. Drained always includes a value. You take a status penalty equal to your drained value on Constitution-based checks, such as Fortitude saves. You also lose a number of Hit Points equal to your level (minimum 1) times the drained value, and your maximum Hit Points are reduced by the same amount. For example, if you’re hit by an effect that inflicts drained 3 and you’re a 3rd-level character, you lose 9 Hit Points and reduce your maximum Hit Points by 9. Losing these Hit Points doesn’t count as taking damage.<br/><br/> Each time you get a full night’s rest, your drained value decreases by 1. This increases your maximum Hit Points, but you don’t immediately recover the lost Hit Points.',
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'dying',
    name: 'dying',
    description:
      'You are bleeding out or otherwise at death’s door. While you have this condition, you are @condition:unconscious@. Dying always includes a value, and if it ever reaches dying 4, you die. If you’re dying, you must attempt a recovery check at the start of your turn each round to determine whether you get better or worse. Your dying condition increases by 1 if you take damage while dying, or by 2 if you take damage from an enemy’s critical hit or a critical failure on your save.<br/><br/> If you lose the dying condition by succeeding at a recovery check and are still at 0 Hit Points, you remain unconscious, but you can wake up as described in that condition. You lose the dying condition automatically and wake up if you ever have 1 Hit Point or more. Any time you lose the dying condition, you gain the @condition:wounded@ 1 condition, or increase your wounded condition value by 1 if you already have that condition.',
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'encumbered',
    name: 'encumbered',
    description:
      'You are carrying more weight than you can manage. While you’re encumbered, you’re @condition:clumsy@ 1 and take a 10-foot penalty to all your Speeds. As with all penalties to your Speed, this can’t reduce your Speed below 5 feet.',
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'enfeebled',
    name: 'enfeebled',
    description:
      "You're physically weakened. Enfeebled always includes a value. When you are enfeebled, you take a status penalty equal to the condition value to Strength-based rolls and DCs, including Strength-based melee attack rolls, Strength-based damage rolls, and Athletics checks.",
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'fascinated',
    name: 'fascinated',
    description:
      "You are compelled to focus your attention on something, distracting you from whatever else is going on around you. You take a –2 status penalty to Perception and skill checks, and you can't use actions with the @trait:concentrate@ trait unless they or their intended consequences are related to the subject of your fascination (as determined by the GM). For instance, you might be able to Seek and Recall Knowledge about the subject, but you likely couldn't cast a spell targeting a different creature. This condition ends if a creature uses hostile actions against you or any of your allies.",
    source: [
      {
        title: 'Core Rulebook',
        page: '619',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'fatigued',
    name: 'fatigued',
    description:
      "You're tired and can't summon much energy. You take a –1 status penalty to AC and saving throws. You can't use exploration activities performed while traveling, such as those listed here. <br/><br/>You recover from fatigue after a full night's rest.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'flat-footed',
    name: 'flat-footed',
    description:
      'You’re distracted or otherwise unable to focus your full attention on defense. You take a –2 circumstance penalty to AC. Some effects give you the flat-footed condition only to certain creatures or against certain attacks. Others—especially conditions—can make you universally flat-footed against everything. If a rule doesn’t specify that the condition applies only to certain circumstances, it applies to all of them; for example, many effects simply say “The target is flat-footed.”',
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'off-guard',
    name: 'off-guard',
    description:
      'You’re distracted or otherwise unable to focus your full attention on defense. You take a –2 circumstance penalty to AC. Some effects give you the off-guard condition only to certain creatures or against certain attacks. Others—especially conditions—can make you universally off-guard against everything. If a rule doesn’t specify that the condition applies only to certain circumstances, it applies to all of them; for example, many effects simply say “The target is off-guard.”',
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'fleeing',
    name: 'fleeing',
    description:
      "You're forced to run away due to fear or some other compulsion. On your turn, you must spend each of your actions trying to escape the source of the fleeing condition as expediently as possible (such as by using move actions to flee, or opening doors barring your escape). The source is usually the effect or caster that gave you the condition, though some effects might define something else as the source. You can't Delay or Ready while fleeing.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'friendly',
    name: 'friendly',
    description:
      "This condition reflects a creature's disposition toward a particular character, and only supernatural effects (like a spell) can impose this condition on a PC. A creature that is friendly to a character likes that character. The character can attempt to Make a Request of a friendly creature, and the friendly creature is likely to agree to a simple and safe request that doesn't cost it much to fulfill. If the character or one of their allies uses hostile actions against the creature, the creature gains a worse attitude condition depending on the severity of the hostile action, as determined by the GM.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'frightened',
    name: 'frightened',
    description:
      'You’re gripped by fear and struggle to control your nerves. The frightened condition always includes a value. You take a status penalty equal to this value to all your checks and DCs. Unless specified otherwise, at the end of each of your turns, the value of your frightened condition decreases by 1.',
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'grabbed',
    name: 'grabbed',
    description:
      "You're held in place by another creature, giving you the @condition:off-guard@ and @condition:immobilized@ conditions. If you attempt a @trait:manipulate@ action while grabbed, you must succeed at a DC 5 flat check or it is lost; roll the check after spending the action, but before any effects are applied.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'helpful',
    name: 'helpful',
    description:
      "This condition reflects a creature's disposition toward a particular character, and only supernatural effects (like a spell) can impose this condition on a PC. A creature that is helpful to a character wishes to actively aid that character. It will accept reasonable Requests from that character, as long as such requests aren't at the expense of the helpful creature's goals or quality of life. If the character or one of their allies uses a hostile action against the creature, the creature gains a worse attitude condition depending on the severity of the hostile action, as determined by the GM.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'hidden',
    name: 'hidden',
    description:
      "While you're hidden from a creature, that creature knows the space you're in but can't tell precisely where you are. You typically become hidden by using Stealth to Hide. When Seeking a creature using only imprecise senses, it remains hidden, rather than @condition:observed@. A creature you're hidden from is @condition:off-guard@ to you, and it must succeed at a DC 11 flat check when targeting you with an attack, spell, or other effect or it fails to affect you. Area effects aren't subject to this flat check. <br/><br/>A creature might be able to use the Seek action to try to observe you.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'hostile',
    name: 'hostile',
    description:
      "This condition reflects a creature's disposition toward a particular character, and only supernatural effects (like a spell) can impose this condition on a PC. A creature that is hostile to a character actively seeks to harm that character. It doesn't necessarily attack, but it won't accept Requests from the character.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'immobilized',
    name: 'immobilized',
    description:
      "You can't use any action with the @condition:move@ trait. If you're immobilized by something holding you in place and an external force would move you out of your space, the force must succeed at a check against either the DC of the effect holding you in place or the relevant defense (usually Fortitude DC) of the monster holding you in place.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'indifferent',
    name: 'indifferent',
    description:
      "This condition reflects a creature's disposition toward a particular character, and only supernatural effects (like a spell) can impose this condition on a PC. A creature that is indifferent to a character doesn't really care one way or the other about that character. Assume a creature's attitude to a given character is indifferent unless specified otherwise.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'invisible',
    name: 'invisible',
    description:
      "While invisible, you can't be seen. You're @condition:undetected@ to everyone. Creatures can Seek to attempt to detect you; if a creature succeeds at its Perception check against your Stealth DC, you become @condition:hidden@ to that creature until you Sneak to become undetected again. If you become invisible while someone can already see you, you start out hidden to the observer (instead of undetected) until you successfully Sneak. You can't become @condition:observed@ while invisible except via special abilities or magic.",
    source: [
      {
        title: 'Core Rulebook',
        page: '620',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'observed',
    name: 'observed',
    description:
      'Anything in plain view is observed by you. If a creature takes measures to avoid detection, such as by using Stealth to Hide, it can become @condition:hidden@ or @condition:undetected@ instead of observed. If you have another precise sense instead of or in addition to sight, you might be able to observe a creature or object using that sense instead. You can observe a creature only with precise senses. When Seeking a creature using only imprecise senses, it remains hidden, rather than observed.',
    source: [
      {
        title: 'Core Rulebook',
        page: '621',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'paralyzed',
    name: 'paralyzed',
    description:
      "Your body is frozen in place. You have the @condition:off-guard@ condition and can't act except to Recall Knowledge and use actions that require only the use of your mind (as determined by the GM). Your senses still function, but only in the areas you can perceive without moving your body, so you can't Seek while paralyzed.",
    source: [
      {
        title: 'Core Rulebook',
        page: '621',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'persistent-damage',
    name: 'persistent damage',
    description:
      'Persistent damage comes from effects like acid, being on fire, or many other situations. It appears as “X persistent [type] damage,” where “X” is the amount of damage dealt and “[type]” is the damage type. Like normal damage, it can be doubled or halved based on the results of an attack roll or saving throw. Instead of taking persistent damage immediately, you take it at the end of each of your turns as long as you have the condition, rolling any damage dice anew each time. After you take persistent damage, roll a DC 15 flat check to see if you recover from the persistent damage. If you succeed, the condition ends.',
    source: [
      {
        title: 'Core Rulebook',
        page: '621',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'petrified',
    name: 'petrified',
    description:
      'You have been turned to stone. You can’t act, nor can you sense anything. You become an object with a Bulk double your normal Bulk (typically 12 for a petrified Medium creature or 6 for a petrified Small creature), AC 9, Hardness 8, and the same current Hit Points you had when alive. You don’t have a Broken Threshold. When you’re turned back into flesh, you have the same number of Hit Points you had as a statue. If the statue is destroyed, you immediately die. While petrified, your mind and body are in stasis, so you don’t age or notice the passing of time.',
    source: [
      {
        title: 'Core Rulebook',
        page: '621',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'prone',
    name: 'prone',
    description:
      "You're lying on the ground. You are @condition:off-guard@ and take a –2 circumstance penalty to attack rolls. The only move actions you can use while you're prone are Crawl and Stand. Standing up ends the prone condition. You can Take Cover while prone to hunker down and gain greater cover against ranged attacks, even if you don't have an object to get behind, gaining a +4 circumstance bonus to AC against ranged attacks (but you remain flat-footed). <br/><br/>If you would be knocked prone while you're Climbing or Flying, you fall (see Falling for the rules on falling). You can't be knocked prone when Swimming.",
    source: [
      {
        title: 'Core Rulebook',
        page: '621',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'quickened',
    name: 'quickened',
    description:
      'You gain 1 additional action at the start of your turn each round. Many effects that make you quickened specify the types of actions you can use with this additional action. If you become quickened from multiple sources, you can use the extra action you’ve been granted for any single action allowed by any of the effects that made you quickened. Because quickened has its effect at the start of your turn, you don’t immediately gain actions if you become quickened during your turn.',
    source: [
      {
        title: 'Core Rulebook',
        page: '621',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'restrained',
    name: 'restrained',
    description:
      "You're tied up and can barely move, or a creature has you pinned. You have the @condition:off-guard@ and @condition:immobilized@ conditions, and you can't use any actions with the @trait:attack@ or @trait:manipulate@ traits except to attempt to Escape or Force Open your bonds. Restrained overrides @condition:grabbed@.",
    source: [
      {
        title: 'Core Rulebook',
        page: '622',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'sickened',
    name: 'sickened',
    description:
      "You feel ill. Sickened always includes a value. You take a status penalty equal to this value on all your checks and DCs. You can't willingly ingest anything—including elixirs and potions—while sickened. <br/><br/>You can spend a single action retching in an attempt to recover, which lets you immediately attempt a Fortitude save against the DC of the effect that made you sickened. On a success, you reduce your sickened value by 1 (or by 2 on a critical success).",
    source: [
      {
        title: 'Core Rulebook',
        page: '622',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'slowed',
    name: 'slowed',
    description:
      "You have fewer actions. Slowed always includes a value. When you regain your actions at the start of your turn, reduce the number of actions you regain by your slowed value. Because slowed has its effect at the start of your turn, you don't immediately lose actions if you become slowed during your turn.",
    source: [
      {
        title: 'Core Rulebook',
        page: '622',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'stunned',
    name: 'stunned',
    description:
      "You've become senseless. You can't act while stunned. Stunned usually includes a value, which indicates how many total actions you lose, possibly over multiple turns, from being stunned. Each time you regain actions (such as at the start of your turn), reduce the number you regain by your stunned value, then reduce your stunned value by the number of actions you lost. For example, if you were stunned 4, you would lose all 3 of your actions on your turn, reducing you to stunned 1; on your next turn, you would lose 1 more action, and then be able to use your remaining 2 actions normally. Stunned might also have a duration instead of a value, such as “stunned for 1 minute.” In this case, you lose all your actions for the listed duration. <br/><br/>Stunned overrides @condition:slowed@. If the duration of your stunned condition ends while you are slowed, you count the actions lost to the stunned condition toward those lost to being slowed. So, if you were stunned 1 and slowed 2 at the beginning of your turn, you would lose 1 action from stunned, and then lose only 1 additional action by being slowed, so you would still have 1 action remaining to use that turn.",
    source: [
      {
        title: 'Core Rulebook',
        page: '622',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'stupified',
    name: 'stupified',
    description:
      'Your thoughts and instincts are clouded. Stupefied always includes a value. You take a status penalty equal to this value on Intelligence-, Wisdom-, and Charisma-based checks and DCs, including Will saving throws, spell attack rolls, spell DCs, and skill checks that use these ability scores. Any time you attempt to Cast a Spell while stupefied, the spell is disrupted unless you succeed at a flat check with a DC equal to 5 + your stupefied value.',
    source: [
      {
        title: 'Core Rulebook',
        page: '622',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'unconscious',
    name: 'unconscious',
    description:
      "You're sleeping, or you've been knocked out. You can't act. You take a –4 status penalty to AC, Perception, and Reflex saves, and you have the blinded and flat-footed conditions. When you gain this condition, you fall prone and drop items you are wielding or holding unless the effect states otherwise or the GM determines you're in a position in which you wouldn't.<br/><br/>If you're unconscious because you're dying, you can't wake up while you have 0 Hit Points. If you are restored to 1 Hit Point or more via healing, you lose the dying and unconscious conditions and can act normally on your next turn.<br/><br/>If you are unconscious and at 0 Hit Points, but not dying, you naturally return to 1 Hit Point and awaken after sufficient time passes. The GM determines how long you remain unconscious, from a minimum of 10 minutes to several hours. If you receive healing during this time, you lose the unconscious condition and can act normally on your next turn.<br/><br/>If you're unconscious and have more than 1 Hit Point (typically because you are asleep or unconscious due to an effect), you wake up in one of the following ways. Each causes you to lose the unconscious condition.<ul><li>You take damage, provided the damage doesn't reduce you to 0 Hit Points. If the damage reduces you to 0 Hit Points, you remain unconscious and gain the dying condition as normal.</li><li>You receive healing, other than the natural healing you get from resting.</li><li>Someone shakes you awake with an Interact action.</li><li>There's loud noise going on around you—though this isn't automatic. At the start of your turn, you automatically attempt a Perception check against the noise's DC (or the lowest DC if there is more than one noise), waking up if you succeed. If creatures are attempting to stay quiet around you, this Perception check uses their Stealth DCs. Some magical effects make you sleep so deeply that they don't allow you to attempt this Perception check.</li><li>If you are simply asleep, the GM decides you wake up either because you have had a restful night's sleep or something disrupted that rest.</li></ul>",
    source: [
      {
        title: 'Core Rulebook',
        page: '622',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'undetected',
    name: 'undetected',
    description:
      "When you are undetected by a creature, that creature cannot see you at all, has no idea what space you occupy, and can't target you, though you still can be affected by abilities that target an area. When you're undetected by a creature, that creature is @condition:off-guard@ to you.<br/><br/>A creature you're undetected by can guess which square you're in to try targeting you. It must pick a square and attempt an attack. This works like targeting a @condition:hidden@ creature (requiring a DC 11 flat check), but the flat check and attack roll are rolled in secret by the GM, who doesn't reveal whether the attack missed due to failing the flat check, failing the attack roll, or choosing the wrong square.<br/><br/>A creature can use the Seek action to try to find you.",
    source: [
      {
        title: 'Core Rulebook',
        page: '623',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'unfriendly',
    name: 'unfriendly',
    description:
      "This condition reflects a creature's disposition toward a particular character, and only supernatural effects (like a spell) can impose this condition on a PC. A creature that is unfriendly to a character dislikes and specifically distrusts that character. The unfriendly creature won't accept Requests from the character.",
    source: [
      {
        title: 'Core Rulebook',
        page: '623',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'unnoticed',
    name: 'unnoticed',
    description:
      "If you are unnoticed by a creature, that creature has no idea you are present at all. When you're unnoticed, you're also @condition:undetected@ by the creature. This condition matters for abilities that can be used only against targets totally unaware of your presence.",
    source: [
      {
        title: 'Core Rulebook',
        page: '623',
      },
    ],
    entity_type: 'CONDITION',
  },
  {
    id: 'wounded',
    name: 'wounded',
    description:
      'You have been seriously injured. If you lose the dying condition and do not already have the @condition:wounded@ condition, you become wounded 1. If you already have the wounded condition when you lose the dying condition, your wounded condition value increases by 1. If you gain the dying condition while wounded, increase your dying condition value by your wounded value.<br/><br/>The wounded condition ends if someone successfully restores Hit Points to you with Treat Wounds, or if you are restored to full Hit Points and rest for 10 minutes.',
    source: [
      {
        title: 'Core Rulebook',
        page: '623',
      },
    ],
    entity_type: 'CONDITION',
  },
]
