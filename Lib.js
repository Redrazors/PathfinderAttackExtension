import { Record, declare, Union } from "./fable-library.2.3.5/Types";
import { tuple, array, string, bool, float64, record, int32, union } from "./fable-library.2.3.5/Reflection";
import { map } from "./fable-library.2.3.5/Seq";
import { comparePrimitives } from "./fable-library.2.3.5/Util";
import { ofSeq } from "./fable-library.2.3.5/Map";
export const SizeType = declare(function Lib_SizeType(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function SizeType$reflection() {
  return union("Lib.SizeType", [], SizeType, () => ["Fine", "Diminuitive", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Colossal"]);
}
export const AbilityScore = declare(function Lib_AbilityScore(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function AbilityScore$reflection() {
  return union("Lib.AbilityScore", [], AbilityScore, () => ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma", "NoAS"]);
}
export const DamageTypes = declare(function Lib_DamageTypes(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function DamageTypes$reflection() {
  return union("Lib.DamageTypes", [], DamageTypes, () => ["Fire", "Slashing", "Bludgeoning", "Piercing", "Cold", "Acid", "Electricity", "Untyped", "BludgeoningOrPiercing", "BludgeoningOrPiercingOrSlashing", "PiercingOrSlashing", "Precision", "VitalStrikeDamage"]);
}
export const BonusTypes = declare(function Lib_BonusTypes(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function BonusTypes$reflection() {
  return union("Lib.BonusTypes", [], BonusTypes, () => ["Insight", "Moral", "Luck", "Alchemical", "Profane", "Sacred", "Circumstance", "Flat", "Size", "TwoWeaponFightingMalus", "Polymorph", "Competence"]);
}
export const BonusAttacksType = declare(function Lib_BonusAttacksType(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function BonusAttacksType$reflection() {
  return union("Lib.BonusAttacksType", [], BonusAttacksType, () => ["HasteLike", "TWFLike", "FlurryOfBlowsLike", "FlatBA", "NoBA"]);
}
export const WeaponType = declare(function Lib_WeaponType(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function WeaponType$reflection() {
  return union("Lib.WeaponType", [], WeaponType, () => ["PrimaryMain", "Primary", "Secondary", "All"]);
}
export const NaturalManufactured = declare(function Lib_NaturalManufactured(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function NaturalManufactured$reflection() {
  return union("Lib.NaturalManufactured", [], NaturalManufactured, () => ["Natural", "Manufactured"]);
}
export const WeaponHanded = declare(function Lib_WeaponHanded(tag, name, ...fields) {
  Union.call(this, tag, name, ...fields);
}, Union);
export function WeaponHanded$reflection() {
  return union("Lib.WeaponHanded", [], WeaponHanded, () => ["OneHanded", "TwoHanded", "OffHand"]);
}
export const SizeAttributes = declare(function Lib_SizeAttributes(arg1, arg2, arg3) {
  this.SizeModifier = arg1 | 0;
  this.SizeId = arg2 | 0;
  this.Size = arg3;
}, Record);
export function SizeAttributes$reflection() {
  return record("Lib.SizeAttributes", [], SizeAttributes, () => [["SizeModifier", int32], ["SizeId", int32], ["Size", SizeType$reflection()]]);
}
export const Damage = declare(function Lib_Damage(arg1, arg2, arg3) {
  this.NumberOfDie = arg1 | 0;
  this.Die = arg2 | 0;
  this.DamageType = arg3;
}, Record);
export function Damage$reflection() {
  return record("Lib.Damage", [], Damage, () => [["NumberOfDie", int32], ["Die", int32], ["DamageType", DamageTypes$reflection()]]);
}
export const DamageHitAndCrit = declare(function Lib_DamageHitAndCrit(arg1, arg2) {
  this.OnHit = arg1;
  this.OnCrit = arg2;
}, Record);
export function DamageHitAndCrit$reflection() {
  return record("Lib.DamageHitAndCrit", [], DamageHitAndCrit, () => [["OnHit", Damage$reflection()], ["OnCrit", Damage$reflection()]]);
}
export const WeaponDamageMultiplicator = declare(function Lib_WeaponDamageMultiplicator(arg1, arg2) {
  this.Hand = arg1;
  this.Multiplicator = arg2;
}, Record);
export function WeaponDamageMultiplicator$reflection() {
  return record("Lib.WeaponDamageMultiplicator", [], WeaponDamageMultiplicator, () => [["Hand", WeaponHanded$reflection()], ["Multiplicator", float64]]);
}
export const UsedModifier = declare(function Lib_UsedModifier(arg1, arg2, arg3) {
  this.ToHit = arg1;
  this.ToDmg = arg2;
  this.MultiplicatorOnDamage = arg3;
}, Record);
export function UsedModifier$reflection() {
  return record("Lib.UsedModifier", [], UsedModifier, () => [["ToHit", AbilityScore$reflection()], ["ToDmg", AbilityScore$reflection()], ["MultiplicatorOnDamage", WeaponDamageMultiplicator$reflection()]]);
}
export const BonusAttacks = declare(function Lib_BonusAttacks(arg1, arg2, arg3) {
  this.NumberOfBonusAttacks = arg1 | 0;
  this.TypeOfBonusAttacks = arg2;
  this.WeaponTypeWithBonusAttacks = arg3;
}, Record);
export function BonusAttacks$reflection() {
  return record("Lib.BonusAttacks", [], BonusAttacks, () => [["NumberOfBonusAttacks", int32], ["TypeOfBonusAttacks", BonusAttacksType$reflection()], ["WeaponTypeWithBonusAttacks", WeaponType$reflection()]]);
}
export const StatChange = declare(function Lib_StatChange(arg1, arg2, arg3) {
  this.Attribute = arg1;
  this.AttributeChange = arg2 | 0;
  this.Bonustype = arg3;
}, Record);
export function StatChange$reflection() {
  return record("Lib.StatChange", [], StatChange, () => [["Attribute", AbilityScore$reflection()], ["AttributeChange", int32], ["Bonustype", BonusTypes$reflection()]]);
}
export const Bonus = declare(function Lib_Bonus(arg1, arg2) {
  this.Value = arg1 | 0;
  this.BonusType = arg2;
}, Record);
export function Bonus$reflection() {
  return record("Lib.Bonus", [], Bonus, () => [["Value", int32], ["BonusType", BonusTypes$reflection()]]);
}
export const SizeChange = declare(function Lib_SizeChange(arg1, arg2, arg3) {
  this.SizeChangeValue = arg1 | 0;
  this.SizeChangeBonustype = arg2;
  this.EffectiveSizeChange = arg3;
}, Record);
export function SizeChange$reflection() {
  return record("Lib.SizeChange", [], SizeChange, () => [["SizeChangeValue", int32], ["SizeChangeBonustype", BonusTypes$reflection()], ["EffectiveSizeChange", bool]]);
}
export const AttackBonusHitAndCrit = declare(function Lib_AttackBonusHitAndCrit(arg1, arg2) {
  this.OnHit = arg1;
  this.OnCrit = arg2;
}, Record);
export function AttackBonusHitAndCrit$reflection() {
  return record("Lib.AttackBonusHitAndCrit", [], AttackBonusHitAndCrit, () => [["OnHit", Bonus$reflection()], ["OnCrit", Bonus$reflection()]]);
}
export function createStatChange(att, attChange, bType) {
  return new StatChange(att, attChange, bType);
}
export function createWeaponDamageMultiplicator(handling, multiplicator) {
  return new WeaponDamageMultiplicator(handling, multiplicator);
}
export function createBonus(value, bType$$1) {
  return new Bonus(value, bType$$1);
}
export function createBonusAttacks(num, bonusAttackType, appliedToWeaponType) {
  return new BonusAttacks(num, bonusAttackType, appliedToWeaponType);
}
export function createDamage(num$$1, die, dType) {
  return new Damage(num$$1, die, dType);
}
export function createUsedModifier(hitting, damage, handling$$1, multiplicator$$1) {
  return new UsedModifier(hitting, damage, createWeaponDamageMultiplicator(handling$$1, multiplicator$$1));
}
export function createSizechange(value$$1, bonusType, effectiveSizeChange) {
  return new SizeChange(value$$1, bonusType, effectiveSizeChange);
}
export function createStringForLib(inputString) {
  return Array.from(map(function mapping(x) {
    return x.toLocaleUpperCase();
  }, inputString.split(""))).join("");
}
export function createSizeAttributes(modifier, id, sizeType) {
  return new SizeAttributes(modifier, id, sizeType);
}
export function createAttackBoniHitAndCrit(hitValue, hitValueType, critValue, critValueType) {
  return new AttackBonusHitAndCrit(createBonus(hitValue, hitValueType), createBonus(critValue, critValueType));
}
export function createDamageHitAndCrit(numberOfDieoOnHit, dieOnHit, dmgTypeOnHit, numberOfDieOnCrit, dieOnCrit, dmgTypeOnCrit) {
  return new DamageHitAndCrit(createDamage(numberOfDieoOnHit, dieOnHit, dmgTypeOnHit), createDamage(numberOfDieOnCrit, dieOnCrit, dmgTypeOnCrit));
}
export const findSizes = ofSeq([[1, createSizeAttributes(8, 1, new SizeType(0, "Fine"))], [2, createSizeAttributes(4, 2, new SizeType(1, "Diminuitive"))], [3, createSizeAttributes(2, 3, new SizeType(2, "Tiny"))], [4, createSizeAttributes(1, 4, new SizeType(3, "Small"))], [5, createSizeAttributes(0, 5, new SizeType(4, "Medium"))], [6, createSizeAttributes(-1, 6, new SizeType(5, "Large"))], [7, createSizeAttributes(-2, 7, new SizeType(6, "Huge"))], [8, createSizeAttributes(-4, 8, new SizeType(7, "Gargantuan"))], [9, createSizeAttributes(-8, 9, new SizeType(8, "Colossal"))]], {
  Compare: comparePrimitives
});
export const CharacterStats = declare(function Lib_CharacterStats(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
  this.CharacterName = arg1;
  this.BAB = arg2 | 0;
  this.Strength = arg3 | 0;
  this.Dexterity = arg4 | 0;
  this.Constitution = arg5 | 0;
  this.Intelligence = arg6 | 0;
  this.Wisdom = arg7 | 0;
  this.Charisma = arg8 | 0;
  this.CasterLevel1 = arg9 | 0;
  this.CasterLevel2 = arg10 | 0;
}, Record);
export function CharacterStats$reflection() {
  return record("Lib.CharacterStats", [], CharacterStats, () => [["CharacterName", string], ["BAB", int32], ["Strength", int32], ["Dexterity", int32], ["Constitution", int32], ["Intelligence", int32], ["Wisdom", int32], ["Charisma", int32], ["CasterLevel1", int32], ["CasterLevel2", int32]]);
}
export const Weapon = declare(function Lib_Weapon(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
  this.Name = arg1;
  this.Damage = arg2;
  this.DamageBonus = arg3 | 0;
  this.ExtraDamage = arg4;
  this.BonusAttackRolls = arg5 | 0;
  this.CriticalRange = arg6;
  this.CriticalModifier = arg7 | 0;
  this.Modifier = arg8;
  this.ManufacturedOrNatural = arg9;
  this.Description = arg10;
}, Record);
export function Weapon$reflection() {
  return record("Lib.Weapon", [], Weapon, () => [["Name", string], ["Damage", Damage$reflection()], ["DamageBonus", int32], ["ExtraDamage", DamageHitAndCrit$reflection()], ["BonusAttackRolls", int32], ["CriticalRange", array(int32)], ["CriticalModifier", int32], ["Modifier", UsedModifier$reflection()], ["ManufacturedOrNatural", NaturalManufactured$reflection()], ["Description", string]]);
}
export const AttackModification = declare(function Lib_AttackModification(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
  this.Name = arg1;
  this.BonusAttacks = arg2;
  this.BonusAttackRoll = arg3;
  this.BonusDamage = arg4;
  this.ExtraDamage = arg5;
  this.AppliedTo = arg6;
  this.StatChanges = arg7;
  this.SizeChanges = arg8;
  this.Description = arg9;
}, Record);
export function AttackModification$reflection() {
  return record("Lib.AttackModification", [], AttackModification, () => [["Name", string], ["BonusAttacks", BonusAttacks$reflection()], ["BonusAttackRoll", AttackBonusHitAndCrit$reflection()], ["BonusDamage", Bonus$reflection()], ["ExtraDamage", DamageHitAndCrit$reflection()], ["AppliedTo", tuple(array(WeaponType$reflection()), int32)], ["StatChanges", array(StatChange$reflection())], ["SizeChanges", SizeChange$reflection()], ["Description", string]]);
}
export const AidAnother = new AttackModification("Aid Another", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], 1], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const BlessingOfFervorAttackBonus = new AttackModification("Blessing of Fervor", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(2, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(2, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Blessing of Fervor with the +2 attack bonus as choice");
export function BonusAttackDamage(attack, damage$$1) {
  return new AttackModification("Blessing of Fervor", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(attack, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(damage$$1, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Use this modification to add fast and easy flat boni to attack rolls or to damage");
}
export const Charging = new AttackModification("Charge-Attack", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(2, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const CriticalFocus = new AttackModification("Critical Focus", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 4, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Applies +4 to all crits not, as its not able to separate weapons");
export const DivineFavor = new AttackModification("Divine Favor", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(1, new BonusTypes(2, "Luck"), 0, new BonusTypes(7, "Flat")), createBonus(1, new BonusTypes(2, "Luck")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const EnlargePerson = new AttackModification("Enlarge Person", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [createStatChange(new AbilityScore(0, "Strength"), 2, new BonusTypes(8, "Size")), createStatChange(new AbilityScore(1, "Dexterity"), -2, new BonusTypes(8, "Size"))], createSizechange(1, new BonusTypes(10, "Polymorph"), false), "");
export const Fatigued = new AttackModification("Fatigued", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [createStatChange(new AbilityScore(0, "Strength"), -2, new BonusTypes(7, "Flat")), createStatChange(new AbilityScore(1, "Dexterity"), -2, new BonusTypes(8, "Size"))], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const Flanking = new AttackModification("Flanking", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(2, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const FlurryOfBlows = new AttackModification("Flurry Of Blows", createBonusAttacks(1, new BonusAttacksType(4, "NoBA"), new WeaponType(0, "PrimaryMain")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export function FuriousFocus(bab) {
  return new AttackModification("Furious Focus", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(~~Math.floor(bab / 4 + 1), new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(0, "PrimaryMain")], 1], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
}
export const Haste = new AttackModification("Haste", createBonusAttacks(1, new BonusAttacksType(0, "HasteLike"), new WeaponType(0, "PrimaryMain")), createAttackBoniHitAndCrit(1, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export function InspireCourage(bardLevel) {
  var x$$1, x$$3, x$$5;
  let bonusValue;

  if (x$$1 = bardLevel | 0, bardLevel >= 17) {
    const x$$2 = bardLevel | 0;
    bonusValue = 4;
  } else if (x$$3 = bardLevel | 0, bardLevel >= 11) {
    const x$$4 = bardLevel | 0;
    bonusValue = 3;
  } else if (x$$5 = bardLevel | 0, bardLevel >= 5) {
    const x$$6 = bardLevel | 0;
    bonusValue = 2;
  } else {
    bonusValue = 1;
  }

  return new AttackModification("Inspire Courage", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(bonusValue, new BonusTypes(11, "Competence"), 0, new BonusTypes(7, "Flat")), createBonus(bonusValue, new BonusTypes(11, "Competence")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "For a set level, because of several IC increasing items");
}
export const Invisibility = new AttackModification("Invisibility", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(2, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const Multiattack = new AttackModification("Multiattack", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(3, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(2, "Secondary")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const MutagenStrength = new AttackModification("Strength Mutagen", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [createStatChange(new AbilityScore(0, "Strength"), 4, new BonusTypes(3, "Alchemical")), createStatChange(new AbilityScore(3, "Intelligence"), -2, new BonusTypes(3, "Alchemical"))], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export function PlanarFocusFire(lvl) {
  const NumberOfExtraDie = ~~(lvl / 4) + 1 | 0;
  return new AttackModification("Planar Focus", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(NumberOfExtraDie, 6, new DamageTypes(0, "Fire"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
}
export function PowerAttack(bab$$1) {
  return new AttackModification("Power Attack", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(~~-Math.floor(bab$$1 / 4 + 1), new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(~~(Math.floor(bab$$1 / 4) * 2 + 2), new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
}
export function PowerAttackURL(handed, bab$$2) {
  var x$$7;
  return new AttackModification("Power Attack", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(~~-Math.floor(bab$$2 / 4 + 1), new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), (x$$7 = Math.floor(bab$$2 / 4) * 2 + 2, handed.tag === 0 ? createBonus(~~x$$7, new BonusTypes(7, "Flat")) : handed.tag === 2 ? createBonus(~~(x$$7 * 0.5), new BonusTypes(7, "Flat")) : createBonus(~~(x$$7 * 1.5), new BonusTypes(7, "Flat"))), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Use this only for the calculateURLAttack function");
}
export const Shaken = new AttackModification("Shaken", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(-2, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export function ShockingGrasp(casterLevel, metalTF) {
  return new AttackModification("Intensified Empowered Shocking Grasp", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(metalTF === true ? 3 : 0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(casterLevel > 5 ? 5 : casterLevel, 6, new DamageTypes(6, "Electricity"), casterLevel > 5 ? 5 : casterLevel, 6, new DamageTypes(6, "Electricity")), [[new WeaponType(3, "All")], 1], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Shocking Grasp deals 1d6 / level electricity damage up to a maximum of 5d6.");
}
export function ShockingGraspIntensifiedEmpowered(casterLevel$$1, metalTF$$1) {
  var x$$8, x$$9;
  return new AttackModification("Intensified Empowered Shocking Grasp", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(metalTF$$1 === true ? 3 : 0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit((x$$8 = (casterLevel$$1 > 10 ? 10 : casterLevel$$1) | 0, x$$8 + ~~(x$$8 * 0.5)), 6, new DamageTypes(6, "Electricity"), (x$$9 = (casterLevel$$1 > 10 ? 10 : casterLevel$$1) | 0, x$$9 + ~~(x$$9 * 0.5)), 6, new DamageTypes(6, "Electricity")), [[new WeaponType(3, "All")], 1], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Shocking Grasp deals 1d6 / level electricity damage up to a maximum of 10d6 for this intensified version. Empowered increases the number of all rolled dice by 50%");
}
export function SneakAttack(rogueLevel) {
  return new AttackModification("Sneak Attack", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(~~Math.ceil(rogueLevel / 2), 6, new DamageTypes(11, "Precision"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
}
export function SneakAttackOnce(rogueLevel$$1) {
  return new AttackModification("Sneak Attack", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(~~Math.ceil(rogueLevel$$1 / 2), 6, new DamageTypes(11, "Precision"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], 1], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Sneak Attack on first attack. This can happen due to a stealth attack or an full-round attack action from invisibility");
}
export const TwoWeaponFighting = new AttackModification("Two-Weapon-Fighting", createBonusAttacks(1, new BonusAttacksType(1, "TWFLike"), new WeaponType(1, "Primary")), createAttackBoniHitAndCrit(-2, new BonusTypes(9, "TwoWeaponFightingMalus"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(1, "Primary"), new WeaponType(0, "PrimaryMain")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const TwoWeaponFightingImproved = new AttackModification("Improved Two-Weapon-Fighting", createBonusAttacks(2, new BonusAttacksType(1, "TWFLike"), new WeaponType(1, "Primary")), createAttackBoniHitAndCrit(-2, new BonusTypes(9, "TwoWeaponFightingMalus"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(1, "Primary"), new WeaponType(0, "PrimaryMain")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const VitalStrike = new AttackModification("Vital Strike", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(1, 0, new DamageTypes(12, "VitalStrikeDamage"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "These extra weapon damage dice are not multiplied on a critical hit, but are added to the total");
export const VitalStrikeImproved = new AttackModification("Improved Vital Strike", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(2, 0, new DamageTypes(12, "VitalStrikeDamage"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "These extra weapon damage dice are not multiplied on a critical hit, but are added to the total");
export const VitalStrikeGreater = new AttackModification("Vital Strike", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(3, 0, new DamageTypes(12, "VitalStrikeDamage"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "These extra weapon damage dice are not multiplied on a critical hit, but are added to the total");
export const WeaponFocus = new AttackModification("Weapon Focus", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(1, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "Only use this if you only use one weapon.");
export const WeaponSpecialization = new AttackModification("WeaponSpecialization", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(2, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const Wrath = new AttackModification("Wrath", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(1, new BonusTypes(1, "Moral"), 0, new BonusTypes(7, "Flat")), createBonus(1, new BonusTypes(1, "Moral")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");
export const ZeroMod = new AttackModification("", createBonusAttacks(0, new BonusAttacksType(4, "NoBA"), new WeaponType(3, "All")), createAttackBoniHitAndCrit(0, new BonusTypes(7, "Flat"), 0, new BonusTypes(7, "Flat")), createBonus(0, new BonusTypes(7, "Flat")), createDamageHitAndCrit(0, 0, new DamageTypes(7, "Untyped"), 0, 0, new DamageTypes(7, "Untyped")), [[new WeaponType(3, "All")], -20], [], createSizechange(0, new BonusTypes(7, "Flat"), false), "");