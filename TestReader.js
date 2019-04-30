import { append, concat, map, tryPick, reverse, fold, head, ofSeq } from "fable-library/Array.js";
import { isLetter, isNumber } from "fable-library/Char.js";
import { parse } from "fable-library/Int32.js";
import { array as array$$11, record, string, int32, union } from "fable-library/Reflection.js";
import { match, isMatch, replace, matches, split, create } from "fable-library/RegExp.js";
import { delay, map as map$$1, rangeNumber } from "fable-library/Seq.js";
import { toText, printf, replace as replace$$1, isNullOrEmpty, split as split$$1, trim } from "fable-library/String.js";
import { Record, declare, Union } from "fable-library/Types.js";
export const SizeType = declare(function Elmish_SimpleInput_SizeType(tag, name, ...fields) {
    Union.call(this, tag, name, ...fields);
}, Union);
export function SizeType$reflection() {
    return union("Elmish.SimpleInput.SizeType", [], SizeType, () => ["Fine", "Diminuitive", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Colossal"]);
}
export const AttackVariant = declare(function Elmish_SimpleInput_AttackVariant(tag, name, ...fields) {
    Union.call(this, tag, name, ...fields);
}, Union);
export function AttackVariant$reflection() {
    return union("Elmish.SimpleInput.AttackVariant", [], AttackVariant, () => ["Melee", "Ranged"]);
}
export const URLDamage = declare(function Elmish_SimpleInput_URLDamage(arg1, arg2, arg3, arg4) {
    this.NumberOfDie = arg1 | 0;
    this.Die = arg2 | 0;
    this.BonusDamage = arg3 | 0;
    this.DamageType = arg4;
}, Record);
export function URLDamage$reflection() {
    return record("Elmish.SimpleInput.URLDamage", [], URLDamage, () => [["NumberOfDie", int32], ["Die", int32], ["BonusDamage", int32], ["DamageType", string]]);
}
export function createURLDamage(nOfDie, die, bonusDmg, damageType) {
    return new URLDamage(nOfDie, die, bonusDmg, damageType);
}
export const URLAttack = declare(function Elmish_SimpleInput_URLAttack(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    this.AttackBonus = arg1;
    this.WeaponName = arg2;
    this.WeaponDamage = arg3;
    this.ExtraDamage = arg4;
    this.CriticalRange = arg5;
    this.CriticalModifier = arg6 | 0;
    this.AdditionalEffects = arg7;
}, Record);
export function URLAttack$reflection() {
    return record("Elmish.SimpleInput.URLAttack", [], URLAttack, () => [["AttackBonus", array$$11(int32)], ["WeaponName", string], ["WeaponDamage", URLDamage$reflection()], ["ExtraDamage", URLDamage$reflection()], ["CriticalRange", array$$11(int32)], ["CriticalModifier", int32], ["AdditionalEffects", string]]);
}
export function createURLAttack(attackBonus, weaponName, weaponDamage, extraDamage, criticalRange, criticalModifer, additionalEffects) {
    return new URLAttack(attackBonus, weaponName, weaponDamage, extraDamage, criticalRange, criticalModifer, additionalEffects);
}
export const URLMonsterStats = declare(function Elmish_SimpleInput_URLMonsterStats(arg1, arg2, arg3, arg4, arg5) {
    this.BAB = arg1 | 0;
    this.Str = arg2 | 0;
    this.Dex = arg3 | 0;
    this.Feats = arg4;
    this.Size = arg5;
}, Record);
export function URLMonsterStats$reflection() {
    return record("Elmish.SimpleInput.URLMonsterStats", [], URLMonsterStats, () => [["BAB", int32], ["Str", int32], ["Dex", int32], ["Feats", array$$11(string)], ["Size", SizeType$reflection()]]);
}
export function createURLMonsterStats(bab, str, dex, feats, size) {
    return new URLMonsterStats(bab, str, dex, feats, size);
}
export const URLMonsterAttacks = declare(function Elmish_SimpleInput_URLMonsterAttacks(arg1, arg2, arg3) {
    this.AttackType = arg1;
    this.AttackScheme = arg2;
    this.RelevantMonsterStats = arg3;
}, Record);
export function URLMonsterAttacks$reflection() {
    return record("Elmish.SimpleInput.URLMonsterAttacks", [], URLMonsterAttacks, () => [["AttackType", AttackVariant$reflection()], ["AttackScheme", array$$11(URLAttack$reflection())], ["RelevantMonsterStats", URLMonsterStats$reflection()]]);
}
export function createURLMonsterAttacks(attackVariant, urlAttack, bab$$1, str$$1, dex$$1, feats$$1, size$$1) {
    return new URLMonsterAttacks(attackVariant, urlAttack, createURLMonsterStats(bab$$1, str$$1, dex$$1, feats$$1, size$$1));
}
export function createAttackFromString(str$$2) {
    const regexIterativeAttackBoni = create("\\+\\d+(\\/\\+\\d+)*");
    const regexGetDamage = create("\\((.*?)\\)");
    const regexMatchPlusOnwards = create("\\s*(?=plus\\s)(.*)");
    const regexMatchDamage = create("[0-9]+d[0-9]+((\\+|\\-)[0-9]+)?");
    const regexNumberOfDie = create("[0-9]+(?=d[0-9]+((\\+|\\-)[0-9]+)?)");
    const regexDieSize = create("(?<=[0-9]+d)[0-9]+(?=((\\+|\\-)[0-9]+)?)");
    const regexBonusDamage = create("(?<=[0-9]+d[0-9]+)((\\+|\\-)[0-9]+)?");
    const regexCriticalRange = create("(?<=/)[0-9]+(\\W[0-9}]+)?");
    const regexCriticalModifier = create("(?<=/x)\\d+");
    const regexPlusBoniExtraDamage = create("[0-9]+d[0-9]+((\\+|\\-)[0-9]+)?\\s\\w*");
    const regexPlusBoniExtraDamageType = create("(?<=[0-9]+d[0-9]+((\\+|\\-)[0-9]+)?\\s)\\w*");

    const getInformation = function getInformation(intVal, arr) {
        if (arr[intVal] === "") {
            switch (intVal) {
                case 0:
                    {
                        return "0";
                    }

                case 1:
                    {
                        return "0";
                    }

                case 2:
                    {
                        return "+0";
                    }

                case 3:
                    {
                        return "20-20";
                    }

                case 4:
                    {
                        return "2";
                    }

                case 5:
                    {
                        return "0";
                    }

                case 6:
                    {
                        return "0";
                    }

                case 7:
                    {
                        return "+0";
                    }

                case 8:
                    {
                        return "";
                    }

                case 9:
                    {
                        return "";
                    }

                default:
                    {
                        throw new Error("Unknown Parameter; Error01.1");
                    }
            }
        } else {
            return arr[intVal];
        }
    };

    const getCriticalModifer = function getCriticalModifer(str$$3) {
        const redexMatchSeparator = create("(?<=[0-9]+)\\W(?=[0-9}]+)?");
        const x = split(redexMatchSeparator, str$$3);
        return ofSeq(rangeNumber(parse(x[0], 511, false, 32), 1, parse(x[1], 511, false, 32)), Int32Array);
    };

    let damage;
    const patternMatch = matches(regexGetDamage, str$$2);
    damage = patternMatch.length > 0 ? trim(patternMatch[patternMatch.length - 1][0], "(", ")") : "";
    const attack = replace(regexGetDamage, str$$2, "").trim();
    let patternInput;
    const splitAttackArr = split$$1(attack, [" "], null, 0);
    const checkMultipleAttacks = (isNullOrEmpty(attack) === true ? 0 : isNumber(attack[0]) ? parse(head(splitAttackArr), 511, false, 32) : 1) | 0;
    const weaponName$$1 = fold(function folder(elem, arr$$1) {
        return elem + " " + arr$$1;
    }, "", splitAttackArr.filter(function predicate(x$$4) {
        if (isNullOrEmpty(x$$4) === true) {
            return x$$4 === x$$4;
        } else {
            return isLetter(x$$4[0]) === true;
        }
    })).trim();
    let iterativeAttacks;
    const x$$7 = tryPick(function chooser(x$$6) {
        if (isMatch(regexIterativeAttackBoni, x$$6)) {
            return x$$6;
        } else {
            return null;
        }
    }, reverse(splitAttackArr, Array));
    iterativeAttacks = x$$7 != null ? concat(ofSeq(delay(function () {
        return map$$1(function (i) {
            return map(function mapping(x$$8) {
                return parse(x$$8, 511, false, 32);
            }, split$$1(x$$7, ["/"], null, 0), Int32Array);
        }, rangeNumber(1, 1, checkMultipleAttacks));
    }), Array), Int32Array) : new Int32Array([0]);
    patternInput = [weaponName$$1, iterativeAttacks];
    let weaponDmg;
    const removePlusBoni = replace(regexMatchPlusOnwards, damage, "");
    const getPlusBoni = match(regexMatchPlusOnwards, damage)[0].trim();
    const getBaseDamage = match(regexMatchDamage, removePlusBoni)[0];
    const plusBoniExtraDamage = match(regexPlusBoniExtraDamage, getPlusBoni)[0];
    const plusBoniExtraDamageValues = replace(regexPlusBoniExtraDamageType, plusBoniExtraDamage, "").trim();
    const plusBoniWithoutDamage = replace$$1(replace(regexPlusBoniExtraDamage, getPlusBoni, ""), "plus", "").trim();
    const urlDmg = isNullOrEmpty(getBaseDamage) ? [damage] : [match(regexNumberOfDie, removePlusBoni)[0], match(regexDieSize, removePlusBoni)[0], match(regexBonusDamage, removePlusBoni)[0], match(regexCriticalRange, removePlusBoni)[0], match(regexCriticalModifier, removePlusBoni)[0], match(regexNumberOfDie, plusBoniExtraDamageValues)[0], match(regexDieSize, plusBoniExtraDamageValues)[0], match(regexBonusDamage, plusBoniExtraDamageValues)[0], match(regexPlusBoniExtraDamageType, plusBoniExtraDamage)[0], plusBoniWithoutDamage];
    weaponDmg = urlDmg;

    if (weaponDmg.length === 1) {
        return createURLAttack(patternInput[1], patternInput[0], createURLDamage(0, 0, 0, "flat"), createURLDamage(0, 0, 0, "flat"), new Int32Array([0]), 0, weaponDmg[0]);
    } else {
        return createURLAttack(patternInput[1], patternInput[0], createURLDamage(parse(getInformation(0, weaponDmg), 511, false, 32), parse(getInformation(1, weaponDmg), 511, false, 32), parse(getInformation(2, weaponDmg), 511, false, 32), "flat"), createURLDamage(parse(getInformation(5, weaponDmg), 511, false, 32), parse(getInformation(6, weaponDmg), 511, false, 32), parse(getInformation(7, weaponDmg), 511, false, 32), getInformation(8, weaponDmg)), getCriticalModifer(getInformation(3, weaponDmg)), parse(getInformation(4, weaponDmg), 511, false, 32), getInformation(9, weaponDmg));
    }
}

/// This is the importan function, everything above is used by this one.
/// the input for this function has to be the complete html text of the current webpage, but i don't know how to accomplish this in js.
/// i got everything translated by Fable so maybe you can try this out and tell me the results. 
export function getMonsterInformation(baseString) {
    const regexFindMonsterStats = create("(?s)((?=article-content)|(?=MainContent))(.*?)((?=<div id=\"comments\" class=\"comments\">)|(?=section15)|(?=ECOLOGY)|(?=footer))");

    const regexFindMeleeStats = function regexFindMeleeStats(meleeOrRanged) {
        return create(toText(printf("(?s)(?=%A)(.*?)((?=<br>)|(?=</p>)|(?=<br />))"))(meleeOrRanged));
    };

    const regexFindHTMLTags = create("\\<(.*?)\\>");
    const regexCommaOutsideBrackets = create(",(?![^(]*\\))");
    const regexMatchWithOr = create("(?<=\\s)or(?=\\s)");

    const regexMatchScore = function regexMatchScore(str$$4) {
        return create("(?s)(?<=STATISTICS.*" + str$$4 + "\\s)\\d+");
    };

    const regexBAB = create("(?s)(?<=Base Atk.)(\\+\\d+)(?=.*Skills)");
    const regexGetSpecialFeats = create("(?s)(?<=Feats.*)(\\w+\\s)?(Two\\WWeapon\\sFighting|Power\\sAttack|Rapid\\sShot|Deadly\\sAim)(?=.*Skills)");
    const regexSize = create("(?s)(Fine|Diminuitive|Tiny|Small|Medium|Large|Huge|Gargantuan|Colossal)(?!=.*DEFENSE)");

    const matchSize = function matchSize(str$$5) {
        switch (str$$5) {
            case "Fine":
                {
                    return new SizeType(0, "Fine");
                }

            case "Diminuitive":
                {
                    return new SizeType(1, "Diminuitive");
                }

            case "Tiny":
                {
                    return new SizeType(2, "Tiny");
                }

            case "Small":
                {
                    return new SizeType(3, "Small");
                }

            case "Medium":
                {
                    return new SizeType(4, "Medium");
                }

            case "Large":
                {
                    return new SizeType(5, "Large");
                }

            case "Huge":
                {
                    return new SizeType(6, "Huge");
                }

            case "Gargantuan":
                {
                    return new SizeType(7, "Gargantuan");
                }

            case "Colossal":
                {
                    return new SizeType(8, "Colossal");
                }

            default:
                {
                    throw new Error("found unknown size category in monsterstatblock; Error02.1");
                }
        }
    };

    const monsterInformation = replace$$1(match(regexFindMonsterStats, baseString)[0], "–", "-");
    const monsterInformationWithoutHTML = replace(regexFindHTMLTags, monsterInformation, "");

    const getAttacks = function getAttacks(meleeOrRanged$$1) {
        const attackInfo = replace(regexFindHTMLTags, match(regexFindMeleeStats(meleeOrRanged$$1), monsterInformation)[0], "");
        return map(function mapping$$3(x$$22) {
            return map(createAttackFromString, map(function mapping$$1(x$$23) {
                return x$$23.trim();
            }, split(regexCommaOutsideBrackets, x$$22), Array), Array);
        }, split(regexMatchWithOr, replace$$1(attackInfo, toText(printf("%A"))(meleeOrRanged$$1), "")), Array);
    };

    const attacksMelee = map(function mapping$$4(x$$26) {
        return [new AttackVariant(0, "Melee"), x$$26];
    }, getAttacks(new AttackVariant(0, "Melee")), Array);
    const attacksRanged = map(function mapping$$5(x$$27) {
        return [new AttackVariant(1, "Ranged"), x$$27];
    }, getAttacks(new AttackVariant(1, "Ranged")), Array);
    const attacks = append(attacksMelee, attacksRanged, Array);

    const testMatchToInt = function testMatchToInt(var$) {
        if (var$ != null === true) {
            return parse(var$[0], 511, false, 32) | 0;
        } else {
            return 0;
        }
    };

    return ofSeq(delay(function () {
        return map$$1(function (i$$1) {
            var x$$28;
            return createURLMonsterAttacks(attacks[i$$1][0], attacks[i$$1][1], parse(match(regexBAB, monsterInformationWithoutHTML)[0], 511, false, 32), testMatchToInt(match(regexMatchScore("Str"), monsterInformationWithoutHTML)), testMatchToInt(match(regexMatchScore("Dex"), monsterInformationWithoutHTML)), (x$$28 = matches(regexGetSpecialFeats, monsterInformationWithoutHTML), ofSeq(delay(function () {
                return map$$1(function (i$$2) {
                    return x$$28[i$$2][0];
                }, rangeNumber(0, 1, x$$28.length - 1));
            }), Array)), matchSize(match(regexSize, monsterInformationWithoutHTML)[0]));
        }, rangeNumber(0, 1, attacks.length - 1));
    }), Array).filter(function predicate$$1(x$$29) {
        return x$$29.AttackScheme.some(function (urlAttack$$1) {
            return urlAttack$$1.WeaponName !== "" ? urlAttack$$1.CriticalModifier !== 0 : false;
        });
    });
}