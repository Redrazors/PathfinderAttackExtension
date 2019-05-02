import { isMatch, create } from "./fable-library.2.3.5/RegExp";
import { int32ToString, compareArrays, structuralHash, comparePrimitives, equals, randomNext } from "./fable-library.2.3.5/Util";
import { mapIndexed, fill, collect, fold, map2, equalsWith, append, ofSeq, tryFindIndex, contains, max, groupBy, sum, map, head, sortByDescending, initialize } from "./fable-library.2.3.5/Array";
import { ZeroMod, DamageTypes, VitalStrikeGreater, VitalStrikeImproved, VitalStrike, findSizes, BonusTypes } from "./Lib";
import { find } from "./fable-library.2.3.5/Map";
import { createURLDamage, AttackVariant } from "./Reader";
import { Choice } from "./fable-library.2.3.5/Option";
import { delay, map as map$$1, rangeNumber } from "./fable-library.2.3.5/Seq";
import { toConsole, printf, trimEnd } from "./fable-library.2.3.5/String";

function testForNaturalAttack(str) {
  const regexNaturalAttack = create("(claw|vine|tentacle|bite|gore|hoof|wing|pincers|tail\\sslap|slam|sting|talon|tongue)");
  return isMatch(regexNaturalAttack, str);
}

export function calculateStandardAttack(attackInfo, attackVariant, attackNumber, modifications) {
  var extraDmg$$1, tupledArg$$10, tupledArg$$9, vitalS, extraDmg$$3, tupledArg$$15, tupledArg$$14, vitalS$$1;

  if (attackNumber > attackInfo.length) {
    throw new Error("The chosen url does not provide enough different attacks for the attackNumber given. Try giving a smaller number or 1.");
  }

  const monsterStats = attackInfo[0].RelevantMonsterStats;

  const rollDice = function rollDice(count, diceSides) {
    const rnd = {};

    if (diceSides === 0) {
      return new Int32Array([0]);
    } else {
      return initialize(count, function (_arg1) {
        return randomNext(1, diceSides + 1);
      }, Int32Array);
    }
  };

  let getRndArrElement;
  const rnd$$1 = {};

  getRndArrElement = function (arr) {
    return arr[randomNext(0, arr.length)];
  };

  let wantedMonsterAttack;
  const x$$1 = attackInfo.filter(function predicate(x) {
    return equals(x.AttackType, attackVariant);
  });

  if (x$$1.length === 0) {
    throw new Error("The chosen url does not provide any attacks for the chosen attack type (melee or ranged).");
  } else {
    wantedMonsterAttack = x$$1[attackNumber - 1];
  }

  const wantedAttack = wantedMonsterAttack.AttackScheme[0];
  let patternInput;
  const getAttackRolls = rollDice(10000, 20);
  patternInput = [getRndArrElement(getAttackRolls), getRndArrElement(getAttackRolls)];
  const startSize = (monsterStats.Size.tag === 1 ? 2 : monsterStats.Size.tag === 2 ? 3 : monsterStats.Size.tag === 3 ? 4 : monsterStats.Size.tag === 4 ? 5 : monsterStats.Size.tag === 5 ? 6 : monsterStats.Size.tag === 6 ? 7 : monsterStats.Size.tag === 7 ? 8 : monsterStats.Size.tag === 8 ? 9 : 1) | 0;
  let calculatedSize;
  const changeSizeBy = sum(map(function mapping$$2(tupledArg) {
    if (!equals(tupledArg[0], new BonusTypes(7, "Flat"))) {
      return head(sortByDescending(function projection$$1(x$$6) {
        return x$$6.SizeChangeValue;
      }, tupledArg[1], {
        Compare: comparePrimitives
      })).SizeChangeValue | 0;
    } else if (equals(tupledArg[0], new BonusTypes(7, "Flat"))) {
      return sum(map(function mapping$$1(x$$9) {
        return x$$9.SizeChangeValue;
      }, tupledArg[1], Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$5, $y$$6) {
          return $x$$5 + $y$$6;
        }

      }) | 0;
    } else {
      throw new Error("Unrecognized Pattern of attackBoni in 'addBoniToAttack'");
    }
  }, groupBy(function projection(x$$5) {
    return x$$5.SizeChangeBonustype;
  }, map(function mapping(x$$4) {
    return x$$4.SizeChanges;
  }, modifications.filter(function predicate$$1(x$$3) {
    return x$$3.SizeChanges.EffectiveSizeChange === false;
  }), Array), Array, {
    Equals: equals,
    GetHashCode: structuralHash
  }), Int32Array), {
    GetZero() {
      return 0;
    },

    Add($x$$7, $y$$8) {
      return $x$$7 + $y$$8;
    }

  }) | 0;
  const x$$10 = startSize + changeSizeBy | 0;
  calculatedSize = x$$10 > 9 ? 9 : x$$10 < 1 ? 1 : x$$10;
  const attackBonus = max(wantedAttack.AttackBonus, {
    Compare: comparePrimitives
  }) | 0;
  let attackBoniSize;
  const sizeModifierNew = find(calculatedSize, findSizes).SizeModifier | 0;
  const sizeModifierOld = find(startSize, findSizes).SizeModifier | 0;
  attackBoniSize = sizeModifierNew - sizeModifierOld;
  const attackBoniModifications = sum(map(function mapping$$6(tupledArg$$1) {
    if (!equals(tupledArg$$1[0], new BonusTypes(7, "Flat"))) {
      return max(map(function mapping$$4(x$$18) {
        return x$$18.Value;
      }, tupledArg$$1[1], Int32Array), {
        Compare: comparePrimitives
      }) | 0;
    } else if (equals(tupledArg$$1[0], new BonusTypes(7, "Flat"))) {
      return sum(map(function mapping$$5(x$$19) {
        return x$$19.Value;
      }, tupledArg$$1[1], Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$15, $y$$16) {
          return $x$$15 + $y$$16;
        }

      }) | 0;
    } else {
      throw new Error("Unrecognized Pattern of attackBoni in 'addBoniToAttack'");
    }
  }, groupBy(function projection$$2(x$$17) {
    return x$$17.BonusType;
  }, map(function mapping$$3(x$$16) {
    return x$$16.BonusAttackRoll.OnHit;
  }, modifications, Array), Array, {
    Equals: equals,
    GetHashCode: structuralHash
  }), Int32Array), {
    GetZero() {
      return 0;
    },

    Add($x$$17, $y$$18) {
      return $x$$17 + $y$$18;
    }

  }) | 0;
  let attackBoniWithoutFullRoundFeats;
  const regexTwoWeaponFighting = create("Two\\WWeapon\\sFighting");
  const regexRapidShot = create("Rapid\\sShot");

  const $007CRapidShot$007CNoRapidShot$007C = function $007CRapidShot$007CNoRapidShot$007C(strArr) {
    if (contains(true, map(function (str$$1) {
      return isMatch(regexRapidShot, str$$1);
    }, strArr, Array), {
      Equals($x$$19, $y$$20) {
        return $x$$19 === $y$$20;
      },

      GetHashCode: structuralHash
    }) === true ? equals(attackVariant, new AttackVariant(1, "Ranged")) : false) {
      return new Choice(0, "Choice1Of2", null);
    } else {
      return new Choice(1, "Choice2Of2", null);
    }
  };

  const $007CTwoWeaponFighting$007CNoTwoWeaponFighting$007C = function $007CTwoWeaponFighting$007CNoTwoWeaponFighting$007C(strArr$$1) {
    if ((contains(true, map(function (str$$2) {
      return isMatch(regexTwoWeaponFighting, str$$2);
    }, strArr$$1, Array), {
      Equals($x$$21, $y$$22) {
        return $x$$21 === $y$$22;
      },

      GetHashCode: structuralHash
    }) === true ? wantedMonsterAttack.AttackScheme.length > 1 : false) ? testForNaturalAttack(wantedAttack.WeaponName) === false : false) {
      return new Choice(0, "Choice1Of2", null);
    } else {
      return new Choice(1, "Choice2Of2", null);
    }
  };

  const balanceTwoWeaponMalus = ($007CTwoWeaponFighting$007CNoTwoWeaponFighting$007C(monsterStats.Feats).tag === 1 ? 0 : 2) | 0;
  const balanceRapidShotMalus = ($007CRapidShot$007CNoRapidShot$007C(monsterStats.Feats).tag === 1 ? 0 : 2) | 0;
  attackBoniWithoutFullRoundFeats = balanceTwoWeaponMalus + balanceRapidShotMalus;
  const combinedAttackBoni = attackBonus + attackBoniModifications + attackBoniSize + attackBoniWithoutFullRoundFeats | 0;
  const totalAttackBonus = patternInput[0] + combinedAttackBoni | 0;
  let totalAttackCritBonus;
  const critSpecificBonus = sum(map(function mapping$$9(tupledArg$$2) {
    if (!equals(tupledArg$$2[0], new BonusTypes(7, "Flat"))) {
      return head(sortByDescending(function projection$$4(x$$22) {
        return x$$22.Value;
      }, tupledArg$$2[1], {
        Compare: comparePrimitives
      })).Value | 0;
    } else if (equals(tupledArg$$2[0], new BonusTypes(7, "Flat"))) {
      return sum(map(function mapping$$8(x$$25) {
        return x$$25.Value;
      }, tupledArg$$2[1], Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$27, $y$$28) {
          return $x$$27 + $y$$28;
        }

      }) | 0;
    } else {
      throw new Error("Unrecognized Pattern of attackBoni in 'addBoniToAttack'");
    }
  }, groupBy(function projection$$3(x$$21) {
    return x$$21.BonusType;
  }, map(function mapping$$7(x$$20) {
    return x$$20.BonusAttackRoll.OnCrit;
  }, modifications, Array), Array, {
    Equals: equals,
    GetHashCode: structuralHash
  }), Int32Array), {
    GetZero() {
      return 0;
    },

    Add($x$$29, $y$$30) {
      return $x$$29 + $y$$30;
    }

  }) | 0;
  totalAttackCritBonus = patternInput[1] + combinedAttackBoni + critSpecificBonus;
  let sizeAdjustedWeaponDamage;
  let effectiveSize;
  const changeSizeBy$$1 = sum(map(function mapping$$13(tupledArg$$3) {
    if (!equals(tupledArg$$3[0], new BonusTypes(7, "Flat"))) {
      return max(map(function mapping$$11(x$$28) {
        return x$$28.SizeChangeValue;
      }, tupledArg$$3[1], Int32Array), {
        Compare: comparePrimitives
      }) | 0;
    } else if (equals(tupledArg$$3[0], new BonusTypes(7, "Flat"))) {
      return sum(map(function mapping$$12(x$$29) {
        return x$$29.SizeChangeValue;
      }, tupledArg$$3[1], Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$35, $y$$36) {
          return $x$$35 + $y$$36;
        }

      }) | 0;
    } else {
      throw new Error("Unrecognized Pattern of sizeChangeBoni.");
    }
  }, groupBy(function projection$$5(x$$27) {
    return x$$27.SizeChangeBonustype;
  }, map(function mapping$$10(x$$26) {
    return x$$26.SizeChanges;
  }, modifications, Array), Array, {
    Equals: equals,
    GetHashCode: structuralHash
  }), Int32Array), {
    GetZero() {
      return 0;
    },

    Add($x$$37, $y$$38) {
      return $x$$37 + $y$$38;
    }

  }) | 0;
  const x$$30 = startSize + changeSizeBy$$1 | 0;
  effectiveSize = x$$30 > 9 ? 9 : x$$30 < 1 ? 1 : x$$30;
  const diceRow = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 6], [1, 8], [1, 10], [2, 6], [2, 8], [3, 6], [3, 8], [4, 6], [4, 8], [6, 6], [6, 8], [8, 6], [8, 8], [12, 6], [12, 8], [16, 6], [16, 8], [24, 6], [24, 8], [36, 6], [36, 8]];

  const getSizeChange = function getSizeChange(reCalcWeapon, startS, modifiedS) {
    var odd, even;

    const snowFlakeIncrease = function snowFlakeIncrease(numberofdice, die) {
      if (numberofdice === 1) {
        return [2, die];
      } else {
        return [numberofdice + ~~(Math.floor(numberofdice) * (1 / 3)), die];
      }
    };

    const snowFlakeDecrease = function snowFlakeDecrease(numberofdice$$1, die$$1) {
      if (numberofdice$$1 === 2) {
        return [1, die$$1];
      } else {
        return [numberofdice$$1 - ~~(Math.floor(numberofdice$$1) * (1 / 3)), die$$1];
      }
    };

    const isEven = function isEven(x$$31) {
      return x$$31 % 2 === 0;
    };

    const isOdd = function isOdd(x$$32) {
      return x$$32 % 2 === 1;
    };

    const sizeDiff = modifiedS - startS | 0;
    const decInc = sizeDiff < 0 ? -1 : sizeDiff > 0 ? 1 : 0;
    let adjustedDie;

    if (reCalcWeapon.Die === 2) {
      adjustedDie = [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
    } else if (reCalcWeapon.Die === 3) {
      adjustedDie = [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
    } else if (reCalcWeapon.Die === 4) {
      if (reCalcWeapon.NumberOfDie === 1) {
        adjustedDie = [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
      } else if (odd = reCalcWeapon.NumberOfDie | 0, isOdd(reCalcWeapon.NumberOfDie) === true) {
        const odd$$1 = reCalcWeapon.NumberOfDie | 0;
        adjustedDie = [~~Math.ceil(reCalcWeapon.NumberOfDie / 2), 6];
      } else {
        if (even = reCalcWeapon.NumberOfDie | 0, isEven(reCalcWeapon.NumberOfDie) === true) {
          const even$$1 = reCalcWeapon.NumberOfDie | 0;
          adjustedDie = [~~(reCalcWeapon.NumberOfDie / 2), 8];
        } else {
          throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error4");
        }
      }
    } else if (reCalcWeapon.Die === 6) {
      adjustedDie = [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
    } else if (reCalcWeapon.Die === 8) {
      adjustedDie = [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
    } else if (reCalcWeapon.Die === 10) {
      adjustedDie = [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
    } else if (reCalcWeapon.Die === 12) {
      adjustedDie = [reCalcWeapon.NumberOfDie * 2, 6];
    } else if (reCalcWeapon.Die === 20) {
      adjustedDie = [reCalcWeapon.NumberOfDie * 2, 10];
    } else {
      adjustedDie = reCalcWeapon.Die % 10 === 0 ? [~~(reCalcWeapon.Die / 10) * reCalcWeapon.NumberOfDie, 10] : reCalcWeapon.Die % 6 === 0 ? [~~(reCalcWeapon.Die / 6) * reCalcWeapon.NumberOfDie, 6] : reCalcWeapon.Die % 4 === 0 ? [~~(reCalcWeapon.Die / 4) * reCalcWeapon.NumberOfDie, 4] : [reCalcWeapon.NumberOfDie, reCalcWeapon.Die];
    }

    const adjustedDieNum = adjustedDie[0] | 0;
    const adjustedDietype = adjustedDie[1] | 0;

    const loopResizeWeapon = function loopResizeWeapon(n, nDice, die$$2) {
      var dec, inc, dec$$2, inc$$2;

      loopResizeWeapon: while (true) {
        const stepIncrease = ((startS + ~~decInc * n < 5 ? true : nDice * die$$2 < 6) ? 1 : 2) | 0;
        const stepDecrease = ((startS + ~~decInc * n < 6 ? true : nDice * die$$2 < 8) ? 1 : 2) | 0;
        const findRowPosition = tryFindIndex(function (tupledArg$$4) {
          return tupledArg$$4[0] === nDice ? tupledArg$$4[1] === die$$2 : false;
        }, diceRow);

        if (sizeDiff === 0 ? true : n >= Math.abs(sizeDiff)) {
          return [nDice, die$$2];
        } else {
          let tupledArg$$5;

          if (findRowPosition != null) {
            if (dec = decInc, decInc < 0) {
              const dec$$1 = decInc;
              tupledArg$$5 = findRowPosition < 1 ? diceRow[0] : diceRow[findRowPosition - stepDecrease];
            } else if (inc = decInc, decInc > 0) {
              const inc$$1 = decInc;
              tupledArg$$5 = findRowPosition > diceRow.length - 3 ? snowFlakeIncrease(nDice, die$$2) : diceRow[findRowPosition + stepIncrease];
            } else {
              throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error1");
            }
          } else if (findRowPosition != null === false) {
            if (dec$$2 = decInc, decInc < 0) {
              const dec$$3 = decInc;
              tupledArg$$5 = snowFlakeDecrease(nDice, die$$2);
            } else if (inc$$2 = decInc, decInc > 0) {
              const inc$$3 = decInc;
              tupledArg$$5 = snowFlakeIncrease(nDice, die$$2);
            } else {
              throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error2");
            }
          } else {
            throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error3");
          }

          const $n$$161 = n;
          n = $n$$161 + 1;
          nDice = tupledArg$$5[0];
          die$$2 = tupledArg$$5[1];
          continue loopResizeWeapon;
        }

        break;
      }
    };

    const tupledArg$$6 = loopResizeWeapon(0, adjustedDieNum, adjustedDietype);
    return createURLDamage(tupledArg$$6[0], tupledArg$$6[1], reCalcWeapon.BonusDamage, reCalcWeapon.DamageType);
  };

  sizeAdjustedWeaponDamage = getSizeChange(wantedAttack.WeaponDamage, startSize, effectiveSize);
  let damageRolls;
  const getDamageRolls = rollDice(1000, sizeAdjustedWeaponDamage.Die);
  damageRolls = sum(ofSeq(delay(function () {
    return map$$1(function (i) {
      return getRndArrElement(getDamageRolls);
    }, rangeNumber(1, 1, sizeAdjustedWeaponDamage.NumberOfDie));
  }), Int32Array), {
    GetZero() {
      return 0;
    },

    Add($x$$39, $y$$40) {
      return $x$$39 + $y$$40;
    }

  });
  const modificationDamageBoni = sum(map(function mapping$$17(tupledArg$$7) {
    if (!equals(tupledArg$$7[0], new BonusTypes(7, "Flat"))) {
      return max(map(function mapping$$15(x$$38) {
        return x$$38.Value;
      }, tupledArg$$7[1], Int32Array), {
        Compare: comparePrimitives
      }) | 0;
    } else {
      return sum(map(function mapping$$16(x$$39) {
        return x$$39.Value;
      }, tupledArg$$7[1], Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$45, $y$$46) {
          return $x$$45 + $y$$46;
        }

      }) | 0;
    }
  }, groupBy(function projection$$6(x$$36) {
    return x$$36.BonusType;
  }, map(function mapping$$14(x$$35) {
    return x$$35.BonusDamage;
  }, modifications, Array), Array, {
    Equals: equals,
    GetHashCode: structuralHash
  }), Int32Array), {
    GetZero() {
      return 0;
    },

    Add($x$$47, $y$$48) {
      return $x$$47 + $y$$48;
    }

  }) | 0;
  let totalDamage;
  const x$$40 = damageRolls + sizeAdjustedWeaponDamage.BonusDamage + modificationDamageBoni | 0;
  totalDamage = x$$40 <= 0 ? 1 : x$$40;
  let extraDamageOnHit;

  const getDamageRolls$$1 = function getDamageRolls$$1(numberOfDie, die$$5) {
    const rolledDice = rollDice(1000, die$$5);
    return sum(ofSeq(delay(function () {
      return map$$1(function (i$$1) {
        return getRndArrElement(rolledDice);
      }, rangeNumber(1, 1, numberOfDie));
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$49, $y$$50) {
        return $x$$49 + $y$$50;
      }

    }) | 0;
  };

  const extraDamageModifications = map(function mapping$$20(tupledArg$$11) {
    return [tupledArg$$11[0], String(tupledArg$$11[1])];
  }, (extraDmg$$1 = map(function mapping$$19(tupledArg$$8) {
    return [getDamageRolls$$1(tupledArg$$8[0].NumberOfDie, tupledArg$$8[0].Die), tupledArg$$8[0].DamageType, tupledArg$$8[1]];
  }, map(function mapping$$18(x$$41) {
    return [x$$41.ExtraDamage.OnHit, x$$41.Name];
  }, modifications, Array), Array), modifications.some(function (modi) {
    return (equals(modi, VitalStrike) ? true : equals(modi, VitalStrikeImproved)) ? true : equals(modi, VitalStrikeGreater);
  }) === true ? (tupledArg$$10 = (tupledArg$$9 = (vitalS = head(sortByDescending(function projection$$7(x$$43) {
    return x$$43.ExtraDamage.OnHit.NumberOfDie;
  }, modifications.filter(function (x$$42) {
    return equals(x$$42.ExtraDamage.OnHit.DamageType, new DamageTypes(12, "VitalStrikeDamage"));
  }), {
    Compare: comparePrimitives
  })), [ofSeq(delay(function () {
    return map$$1(function (i$$2) {
      return getDamageRolls$$1(sizeAdjustedWeaponDamage.NumberOfDie, sizeAdjustedWeaponDamage.Die);
    }, rangeNumber(1, 1, vitalS.ExtraDamage.OnHit.NumberOfDie));
  }), Int32Array), vitalS.Name]), [sum(tupledArg$$9[0], {
    GetZero() {
      return 0;
    },

    Add($x$$53, $y$$54) {
      return $x$$53 + $y$$54;
    }

  }), tupledArg$$9[1]]), append([[tupledArg$$10[0], new DamageTypes(12, "VitalStrikeDamage"), tupledArg$$10[1]]], extraDmg$$1, Array)) : extraDmg$$1), Array);
  extraDamageOnHit = extraDamageModifications.filter(function predicate$$2(tupledArg$$12) {
    return tupledArg$$12[0] !== 0;
  });
  let extraDamageOnCrit;

  const getDamageRolls$$2 = function getDamageRolls$$2(numberOfDie$$1, die$$6) {
    const rolledDice$$1 = rollDice(1000, die$$6);
    return sum(ofSeq(delay(function () {
      return map$$1(function (i$$3) {
        return getRndArrElement(rolledDice$$1);
      }, rangeNumber(1, 1, numberOfDie$$1));
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$55, $y$$56) {
        return $x$$55 + $y$$56;
      }

    }) | 0;
  };

  const extraDamageModifications$$1 = contains(patternInput[0], wantedAttack.CriticalRange, {
    Equals($x$$57, $y$$58) {
      return $x$$57 === $y$$58;
    },

    GetHashCode: structuralHash
  }) === false ? [] : map(function mapping$$23(tupledArg$$16) {
    return [tupledArg$$16[0], String(tupledArg$$16[1])];
  }, (extraDmg$$3 = map(function mapping$$22(tupledArg$$13) {
    return [getDamageRolls$$2(tupledArg$$13[0].NumberOfDie, tupledArg$$13[0].Die), tupledArg$$13[0].DamageType, tupledArg$$13[1]];
  }, map(function mapping$$21(x$$45) {
    return [x$$45.ExtraDamage.OnCrit, x$$45.Name];
  }, modifications, Array), Array), modifications.some(function (modi$$1) {
    return (equals(modi$$1, VitalStrike) ? true : equals(modi$$1, VitalStrikeImproved)) ? true : equals(modi$$1, VitalStrikeGreater);
  }) === true ? (tupledArg$$15 = (tupledArg$$14 = (vitalS$$1 = head(sortByDescending(function projection$$8(x$$47) {
    return x$$47.ExtraDamage.OnHit.NumberOfDie;
  }, modifications.filter(function (x$$46) {
    return equals(x$$46.ExtraDamage.OnHit.DamageType, new DamageTypes(12, "VitalStrikeDamage"));
  }), {
    Compare: comparePrimitives
  })), [ofSeq(delay(function () {
    return map$$1(function (i$$4) {
      return getDamageRolls$$2(sizeAdjustedWeaponDamage.NumberOfDie, sizeAdjustedWeaponDamage.Die);
    }, rangeNumber(1, 1, vitalS$$1.ExtraDamage.OnHit.NumberOfDie));
  }), Int32Array), vitalS$$1.Name]), [sum(tupledArg$$14[0], {
    GetZero() {
      return 0;
    },

    Add($x$$61, $y$$62) {
      return $x$$61 + $y$$62;
    }

  }), tupledArg$$14[1]]), append([[tupledArg$$15[0], new DamageTypes(12, "VitalStrikeDamage"), tupledArg$$15[1]]], extraDmg$$3, Array)) : extraDmg$$3), Array);
  extraDamageOnCrit = extraDamageModifications$$1.filter(function predicate$$3(tupledArg$$17) {
    return tupledArg$$17[0] !== 0;
  });
  let extraDamageCombined;

  const getDamageRolls$$3 = function getDamageRolls$$3(numberOfDie$$2, die$$7) {
    const rolledDice$$2 = rollDice(1000, die$$7);
    return sum(ofSeq(delay(function () {
      return map$$1(function (i$$5) {
        return getRndArrElement(rolledDice$$2);
      }, rangeNumber(1, 1, numberOfDie$$2));
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$63, $y$$64) {
        return $x$$63 + $y$$64;
      }

    }) | 0;
  };

  extraDamageCombined = equalsWith(compareArrays, extraDamageOnCrit, []) ? append([[getDamageRolls$$3(wantedAttack.ExtraDamage.NumberOfDie, wantedAttack.ExtraDamage.Die), wantedAttack.ExtraDamage.DamageType]], extraDamageOnHit, Array).filter(function predicate$$4(tupledArg$$18) {
    return tupledArg$$18[0] !== 0;
  }) : append([[getDamageRolls$$3(wantedAttack.ExtraDamage.NumberOfDie, wantedAttack.ExtraDamage.Die), wantedAttack.ExtraDamage.DamageType]], map2(function (onHit, onCrit) {
    return [onHit[0] + onCrit[0], onHit[1]];
  }, extraDamageOnHit, extraDamageOnCrit, Array), Array).filter(function predicate$$5(tupledArg$$19) {
    return tupledArg$$19[0] !== 0;
  });

  const extraDamageToString = function extraDamageToString(extraDmgArr) {
    return trimEnd(fold(function folder(strArr$$2, x$$49) {
      return strArr$$2 + x$$49;
    }, "", map(function mapping$$24(tupledArg$$20) {
      return "+" + int32ToString(tupledArg$$20[0]) + " " + tupledArg$$20[1] + " " + "damage" + ", ";
    }, extraDmgArr, Array)), " ", ",");
  };

  const additionalInfoString = wantedAttack.AdditionalEffects === "" ? "" : "plus " + wantedAttack.AdditionalEffects;

  if (contains(patternInput[0], wantedAttack.CriticalRange, {
    Equals($x$$67, $y$$68) {
      return $x$$67 === $y$$68;
    },

    GetHashCode: structuralHash
  }) === false ? equalsWith(compareArrays, extraDamageCombined, []) : false) {
    toConsole(printf("You attack with a %s and hit with a %i (rolled %i) for %i damage %s!"))(wantedAttack.WeaponName)(totalAttackBonus)(patternInput[0])(totalDamage)(additionalInfoString);
  } else if (contains(patternInput[0], wantedAttack.CriticalRange, {
    Equals($x$$71, $y$$72) {
      return $x$$71 === $y$$72;
    },

    GetHashCode: structuralHash
  }) === true ? equalsWith(compareArrays, extraDamageCombined, []) : false) {
    toConsole(printf("You attack with a %s and (hopefully) critically hit the enemy with a %i (rolled %i) and confirm your crit with a %i (rolled %i) for %i Damage (x %i) %s!"))(wantedAttack.WeaponName)(totalAttackBonus)(patternInput[0])(totalAttackCritBonus)(patternInput[1])(totalDamage)(wantedAttack.CriticalModifier)(additionalInfoString);
  } else if (contains(patternInput[0], wantedAttack.CriticalRange, {
    Equals($x$$75, $y$$76) {
      return $x$$75 === $y$$76;
    },

    GetHashCode: structuralHash
  }) === false ? !equalsWith(compareArrays, extraDamageCombined, []) : false) {
    toConsole(printf("You attack with a %s and hit the enemy with a %i (rolled %i) for %i damage %s %s!"))(wantedAttack.WeaponName)(totalAttackBonus)(patternInput[0])(totalDamage)(extraDamageToString(extraDamageCombined))(additionalInfoString);
  } else if (contains(patternInput[0], wantedAttack.CriticalRange, {
    Equals($x$$79, $y$$80) {
      return $x$$79 === $y$$80;
    },

    GetHashCode: structuralHash
  }) === true ? !equalsWith(compareArrays, extraDamageCombined, []) : false) {
    toConsole(printf("You attack with a %s and (hopefully) critically hit the enemy with a %i (rolled %i) and confirm your crit with a %i (rolled %i) for %i damage (x %i) %s (%s on a crit) / (%s when not confirmed) !"))(wantedAttack.WeaponName)(totalAttackBonus)(patternInput[0])(totalAttackCritBonus)(patternInput[1])(totalDamage)(wantedAttack.CriticalModifier)(additionalInfoString)(extraDamageToString(extraDamageCombined))(extraDamageToString(extraDamageOnHit));
  } else {
    toConsole(printf("You should not see this message, please open an issue with your input as a bug report"));
  }
}
export function calculateFullAttack(attackInfo$$1, attackVariant$$1, attackNumber$$1, modifications$$1) {
  var arr$$2;

  if (attackNumber$$1 > attackInfo$$1.length) {
    throw new Error("The chosen url does not provide enough different attacks for the attackNumber given. Try giving a smaller number or 1.");
  }

  const monsterStats$$1 = attackInfo$$1[0].RelevantMonsterStats;

  const rollDice$$1 = function rollDice$$1(count$$1, diceSides$$1) {
    const rnd$$2 = {};

    if (diceSides$$1 === 0) {
      return new Int32Array([0]);
    } else {
      return initialize(count$$1, function (_arg1$$1) {
        return randomNext(1, diceSides$$1 + 1);
      }, Int32Array);
    }
  };

  let getRndArrElement$$1;
  const rnd$$3 = {};

  getRndArrElement$$1 = function (arr$$1) {
    return arr$$1[randomNext(0, arr$$1.length)];
  };

  let wantedAttack$$1;
  const x$$52 = attackInfo$$1.filter(function predicate$$6(x$$51) {
    return equals(x$$51.AttackType, attackVariant$$1);
  });

  if (x$$52.length === 0) {
    throw new Error("The chosen url does not provide any attacks for the chosen attack type (melee or ranged).");
  } else {
    wantedAttack$$1 = x$$52[attackNumber$$1 - 1];
  }

  const attackArr = collect(function mapping$$25(attack) {
    return ofSeq(delay(function () {
      return map$$1(function (i$$6) {
        return [attack.AttackBonus[i$$6], attack];
      }, rangeNumber(0, 1, attack.AttackBonus.length - 1));
    }), Array);
  }, wantedAttack$$1.AttackScheme, Array);
  const modificationsForAllAttacks = modifications$$1.filter(function predicate$$7(x$$54) {
    return x$$54.AppliedTo[1] === -20;
  });
  let modificationsForNotAllAttacks;

  const attackMaximumLength = function attackMaximumLength(appliedTo) {
    if (appliedTo < attackArr.length) {
      return appliedTo | 0;
    } else {
      return attackArr.length | 0;
    }
  };

  modificationsForNotAllAttacks = map(function mapping$$28(tupledArg$$22) {
    return map(function (tuple) {
      return tuple[1];
    }, tupledArg$$22[1], Array);
  }, groupBy(function projection$$9(tupledArg$$21) {
    return tupledArg$$21[0];
  }, (arr$$2 = modifications$$1.filter(function predicate$$8(x$$55) {
    return x$$55.AppliedTo[1] !== -20;
  }), arr$$2.length === 0 ? mapIndexed(function mapping$$26(i$$7, x$$56) {
    return [i$$7, x$$56];
  }, fill(new Array(attackArr.length), 0, attackArr.length, ZeroMod), Array) : collect(function (x$$57) {
    var x$$58;
    return mapIndexed(function mapping$$27(i$$8, x$$59) {
      return [i$$8, x$$59];
    }, (x$$58 = fill(new Array(x$$57.AppliedTo[1]), 0, x$$57.AppliedTo[1], x$$57), append(x$$58, fill(new Array(attackArr.length - x$$58.length), 0, attackArr.length - x$$58.length, ZeroMod), Array)), Array);
  }, arr$$2, Array)), Array, {
    Equals($x$$83, $y$$84) {
      return $x$$83 === $y$$84;
    },

    GetHashCode: structuralHash
  }), Array);
  const modificationsCombined = map(function mapping$$29(array2$$2) {
    return append(modificationsForAllAttacks, array2$$2, Array);
  }, modificationsForNotAllAttacks, Array);

  const calculateOneAttack = function calculateOneAttack(attackBonus$$1, urlAttack, modificationArr) {
    var extraDmg$$5, tupledArg$$33, tupledArg$$32, vitalS$$2, extraDmg$$7, tupledArg$$38, tupledArg$$37, vitalS$$3;
    let patternInput$$1;
    const getAttackRolls$$1 = rollDice$$1(10000, 20);
    patternInput$$1 = [getRndArrElement$$1(getAttackRolls$$1), getRndArrElement$$1(getAttackRolls$$1)];
    const startSize$$1 = (monsterStats$$1.Size.tag === 1 ? 2 : monsterStats$$1.Size.tag === 2 ? 3 : monsterStats$$1.Size.tag === 3 ? 4 : monsterStats$$1.Size.tag === 4 ? 5 : monsterStats$$1.Size.tag === 5 ? 6 : monsterStats$$1.Size.tag === 6 ? 7 : monsterStats$$1.Size.tag === 7 ? 8 : monsterStats$$1.Size.tag === 8 ? 9 : 1) | 0;
    let calculatedSize$$1;
    const changeSizeBy$$2 = sum(map(function mapping$$32(tupledArg$$23) {
      if (!equals(tupledArg$$23[0], new BonusTypes(7, "Flat"))) {
        return head(sortByDescending(function projection$$11(x$$66) {
          return x$$66.SizeChangeValue;
        }, tupledArg$$23[1], {
          Compare: comparePrimitives
        })).SizeChangeValue | 0;
      } else if (equals(tupledArg$$23[0], new BonusTypes(7, "Flat"))) {
        return sum(map(function mapping$$31(x$$69) {
          return x$$69.SizeChangeValue;
        }, tupledArg$$23[1], Int32Array), {
          GetZero() {
            return 0;
          },

          Add($x$$89, $y$$90) {
            return $x$$89 + $y$$90;
          }

        }) | 0;
      } else {
        throw new Error("Unrecognized Pattern of attackBoni in 'addBoniToAttack'");
      }
    }, groupBy(function projection$$10(x$$65) {
      return x$$65.SizeChangeBonustype;
    }, map(function mapping$$30(x$$64) {
      return x$$64.SizeChanges;
    }, modificationArr.filter(function predicate$$9(x$$63) {
      return x$$63.SizeChanges.EffectiveSizeChange === false;
    }), Array), Array, {
      Equals: equals,
      GetHashCode: structuralHash
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$91, $y$$92) {
        return $x$$91 + $y$$92;
      }

    }) | 0;
    const x$$70 = startSize$$1 + changeSizeBy$$2 | 0;
    calculatedSize$$1 = x$$70 > 9 ? 9 : x$$70 < 1 ? 1 : x$$70;
    let attackBoniSize$$1;
    const sizeModifierNew$$1 = find(calculatedSize$$1, findSizes).SizeModifier | 0;
    const sizeModifierOld$$1 = find(startSize$$1, findSizes).SizeModifier | 0;
    attackBoniSize$$1 = sizeModifierNew$$1 - sizeModifierOld$$1;
    const AttackBoniModifications = sum(map(function mapping$$36(tupledArg$$24) {
      if (!equals(tupledArg$$24[0], new BonusTypes(7, "Flat"))) {
        return max(map(function mapping$$34(x$$77) {
          return x$$77.Value;
        }, tupledArg$$24[1], Int32Array), {
          Compare: comparePrimitives
        }) | 0;
      } else if (equals(tupledArg$$24[0], new BonusTypes(7, "Flat"))) {
        return sum(map(function mapping$$35(x$$78) {
          return x$$78.Value;
        }, tupledArg$$24[1], Int32Array), {
          GetZero() {
            return 0;
          },

          Add($x$$97, $y$$98) {
            return $x$$97 + $y$$98;
          }

        }) | 0;
      } else {
        throw new Error("Unrecognized Pattern of attackBoni in 'addBoniToAttack'");
      }
    }, groupBy(function projection$$12(x$$76) {
      return x$$76.BonusType;
    }, map(function mapping$$33(x$$75) {
      return x$$75.BonusAttackRoll.OnHit;
    }, modificationArr, Array), Array, {
      Equals: equals,
      GetHashCode: structuralHash
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$99, $y$$100) {
        return $x$$99 + $y$$100;
      }

    }) | 0;
    const combinedAttackBoni$$1 = attackBonus$$1 + AttackBoniModifications + attackBoniSize$$1 | 0;
    const totalAttackBonus$$1 = patternInput$$1[0] + combinedAttackBoni$$1 | 0;
    let totalAttackCritBonus$$1;
    const critSpecificBonus$$1 = sum(map(function mapping$$39(tupledArg$$25) {
      if (!equals(tupledArg$$25[0], new BonusTypes(7, "Flat"))) {
        return head(sortByDescending(function projection$$14(x$$81) {
          return x$$81.Value;
        }, tupledArg$$25[1], {
          Compare: comparePrimitives
        })).Value | 0;
      } else if (equals(tupledArg$$25[0], new BonusTypes(7, "Flat"))) {
        return sum(map(function mapping$$38(x$$84) {
          return x$$84.Value;
        }, tupledArg$$25[1], Int32Array), {
          GetZero() {
            return 0;
          },

          Add($x$$105, $y$$106) {
            return $x$$105 + $y$$106;
          }

        }) | 0;
      } else {
        throw new Error("Unrecognized Pattern of attackBoni in 'addBoniToAttack'");
      }
    }, groupBy(function projection$$13(x$$80) {
      return x$$80.BonusType;
    }, map(function mapping$$37(x$$79) {
      return x$$79.BonusAttackRoll.OnCrit;
    }, modifications$$1, Array), Array, {
      Equals: equals,
      GetHashCode: structuralHash
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$107, $y$$108) {
        return $x$$107 + $y$$108;
      }

    }) | 0;
    totalAttackCritBonus$$1 = patternInput$$1[1] + combinedAttackBoni$$1 + critSpecificBonus$$1;
    let sizeAdjustedWeaponDamage$$1;
    let effectiveSize$$1;
    const changeSizeBy$$3 = sum(map(function mapping$$43(tupledArg$$26) {
      if (!equals(tupledArg$$26[0], new BonusTypes(7, "Flat"))) {
        return max(map(function mapping$$41(x$$87) {
          return x$$87.SizeChangeValue;
        }, tupledArg$$26[1], Int32Array), {
          Compare: comparePrimitives
        }) | 0;
      } else if (equals(tupledArg$$26[0], new BonusTypes(7, "Flat"))) {
        return sum(map(function mapping$$42(x$$88) {
          return x$$88.SizeChangeValue;
        }, tupledArg$$26[1], Int32Array), {
          GetZero() {
            return 0;
          },

          Add($x$$113, $y$$114) {
            return $x$$113 + $y$$114;
          }

        }) | 0;
      } else {
        throw new Error("Unrecognized Pattern of sizeChangeBoni.");
      }
    }, groupBy(function projection$$15(x$$86) {
      return x$$86.SizeChangeBonustype;
    }, map(function mapping$$40(x$$85) {
      return x$$85.SizeChanges;
    }, modifications$$1, Array), Array, {
      Equals: equals,
      GetHashCode: structuralHash
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$115, $y$$116) {
        return $x$$115 + $y$$116;
      }

    }) | 0;
    const x$$89 = startSize$$1 + changeSizeBy$$3 | 0;
    effectiveSize$$1 = x$$89 > 9 ? 9 : x$$89 < 1 ? 1 : x$$89;
    const diceRow$$1 = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 6], [1, 8], [1, 10], [2, 6], [2, 8], [3, 6], [3, 8], [4, 6], [4, 8], [6, 6], [6, 8], [8, 6], [8, 8], [12, 6], [12, 8], [16, 6], [16, 8], [24, 6], [24, 8], [36, 6], [36, 8]];

    const getSizeChange$$1 = function getSizeChange$$1(reCalcWeapon$$1, startS$$1, modifiedS$$1) {
      var odd$$2, even$$2;

      const snowFlakeIncrease$$1 = function snowFlakeIncrease$$1(numberofdice$$2, die$$8) {
        if (numberofdice$$2 === 1) {
          return [2, die$$8];
        } else {
          return [numberofdice$$2 + ~~(Math.floor(numberofdice$$2) * (1 / 3)), die$$8];
        }
      };

      const snowFlakeDecrease$$1 = function snowFlakeDecrease$$1(numberofdice$$3, die$$9) {
        if (numberofdice$$3 === 2) {
          return [1, die$$9];
        } else {
          return [numberofdice$$3 - ~~(Math.floor(numberofdice$$3) * (1 / 3)), die$$9];
        }
      };

      const isEven$$1 = function isEven$$1(x$$90) {
        return x$$90 % 2 === 0;
      };

      const isOdd$$1 = function isOdd$$1(x$$91) {
        return x$$91 % 2 === 1;
      };

      const sizeDiff$$1 = modifiedS$$1 - startS$$1 | 0;
      const decInc$$1 = sizeDiff$$1 < 0 ? -1 : sizeDiff$$1 > 0 ? 1 : 0;
      let adjustedDie$$1;

      if (reCalcWeapon$$1.Die === 2) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
      } else if (reCalcWeapon$$1.Die === 3) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
      } else if (reCalcWeapon$$1.Die === 4) {
        if (reCalcWeapon$$1.NumberOfDie === 1) {
          adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
        } else if (odd$$2 = reCalcWeapon$$1.NumberOfDie | 0, isOdd$$1(reCalcWeapon$$1.NumberOfDie) === true) {
          const odd$$3 = reCalcWeapon$$1.NumberOfDie | 0;
          adjustedDie$$1 = [~~Math.ceil(reCalcWeapon$$1.NumberOfDie / 2), 6];
        } else {
          if (even$$2 = reCalcWeapon$$1.NumberOfDie | 0, isEven$$1(reCalcWeapon$$1.NumberOfDie) === true) {
            const even$$3 = reCalcWeapon$$1.NumberOfDie | 0;
            adjustedDie$$1 = [~~(reCalcWeapon$$1.NumberOfDie / 2), 8];
          } else {
            throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error4");
          }
        }
      } else if (reCalcWeapon$$1.Die === 6) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
      } else if (reCalcWeapon$$1.Die === 8) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
      } else if (reCalcWeapon$$1.Die === 10) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
      } else if (reCalcWeapon$$1.Die === 12) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie * 2, 6];
      } else if (reCalcWeapon$$1.Die === 20) {
        adjustedDie$$1 = [reCalcWeapon$$1.NumberOfDie * 2, 10];
      } else {
        adjustedDie$$1 = reCalcWeapon$$1.Die % 10 === 0 ? [~~(reCalcWeapon$$1.Die / 10) * reCalcWeapon$$1.NumberOfDie, 10] : reCalcWeapon$$1.Die % 6 === 0 ? [~~(reCalcWeapon$$1.Die / 6) * reCalcWeapon$$1.NumberOfDie, 6] : reCalcWeapon$$1.Die % 4 === 0 ? [~~(reCalcWeapon$$1.Die / 4) * reCalcWeapon$$1.NumberOfDie, 4] : [reCalcWeapon$$1.NumberOfDie, reCalcWeapon$$1.Die];
      }

      const adjustedDieNum$$1 = adjustedDie$$1[0] | 0;
      const adjustedDietype$$1 = adjustedDie$$1[1] | 0;

      const loopResizeWeapon$$1 = function loopResizeWeapon$$1(n$$2, nDice$$1, die$$10) {
        var dec$$4, inc$$4, dec$$6, inc$$6;

        loopResizeWeapon$$1: while (true) {
          const stepIncrease$$1 = ((startS$$1 + ~~decInc$$1 * n$$2 < 5 ? true : nDice$$1 * die$$10 < 6) ? 1 : 2) | 0;
          const stepDecrease$$1 = ((startS$$1 + ~~decInc$$1 * n$$2 < 6 ? true : nDice$$1 * die$$10 < 8) ? 1 : 2) | 0;
          const findRowPosition$$1 = tryFindIndex(function (tupledArg$$27) {
            return tupledArg$$27[0] === nDice$$1 ? tupledArg$$27[1] === die$$10 : false;
          }, diceRow$$1);

          if (sizeDiff$$1 === 0 ? true : n$$2 >= Math.abs(sizeDiff$$1)) {
            return [nDice$$1, die$$10];
          } else {
            let tupledArg$$28;

            if (findRowPosition$$1 != null) {
              if (dec$$4 = decInc$$1, decInc$$1 < 0) {
                const dec$$5 = decInc$$1;
                tupledArg$$28 = findRowPosition$$1 < 1 ? diceRow$$1[0] : diceRow$$1[findRowPosition$$1 - stepDecrease$$1];
              } else if (inc$$4 = decInc$$1, decInc$$1 > 0) {
                const inc$$5 = decInc$$1;
                tupledArg$$28 = findRowPosition$$1 > diceRow$$1.length - 3 ? snowFlakeIncrease$$1(nDice$$1, die$$10) : diceRow$$1[findRowPosition$$1 + stepIncrease$$1];
              } else {
                throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error1");
              }
            } else if (findRowPosition$$1 != null === false) {
              if (dec$$6 = decInc$$1, decInc$$1 < 0) {
                const dec$$7 = decInc$$1;
                tupledArg$$28 = snowFlakeDecrease$$1(nDice$$1, die$$10);
              } else if (inc$$6 = decInc$$1, decInc$$1 > 0) {
                const inc$$7 = decInc$$1;
                tupledArg$$28 = snowFlakeIncrease$$1(nDice$$1, die$$10);
              } else {
                throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error2");
              }
            } else {
              throw new Error("unknown combination for reCalcWeapon damage dice calculator accoringly to size; Error3");
            }

            const $n$$2$$162 = n$$2;
            n$$2 = $n$$2$$162 + 1;
            nDice$$1 = tupledArg$$28[0];
            die$$10 = tupledArg$$28[1];
            continue loopResizeWeapon$$1;
          }

          break;
        }
      };

      const tupledArg$$29 = loopResizeWeapon$$1(0, adjustedDieNum$$1, adjustedDietype$$1);
      return createURLDamage(tupledArg$$29[0], tupledArg$$29[1], reCalcWeapon$$1.BonusDamage, reCalcWeapon$$1.DamageType);
    };

    sizeAdjustedWeaponDamage$$1 = getSizeChange$$1(urlAttack.WeaponDamage, startSize$$1, effectiveSize$$1);
    let damageRolls$$1;
    const getDamageRolls$$4 = rollDice$$1(1000, sizeAdjustedWeaponDamage$$1.Die);
    damageRolls$$1 = sum(ofSeq(delay(function () {
      return map$$1(function (i$$9) {
        return getRndArrElement$$1(getDamageRolls$$4);
      }, rangeNumber(1, 1, sizeAdjustedWeaponDamage$$1.NumberOfDie));
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$117, $y$$118) {
        return $x$$117 + $y$$118;
      }

    });
    const modificationDamageBoni$$1 = sum(map(function mapping$$47(tupledArg$$30) {
      if (!equals(tupledArg$$30[0], new BonusTypes(7, "Flat"))) {
        return max(map(function mapping$$45(x$$97) {
          return x$$97.Value;
        }, tupledArg$$30[1], Int32Array), {
          Compare: comparePrimitives
        }) | 0;
      } else {
        return sum(map(function mapping$$46(x$$98) {
          return x$$98.Value;
        }, tupledArg$$30[1], Int32Array), {
          GetZero() {
            return 0;
          },

          Add($x$$123, $y$$124) {
            return $x$$123 + $y$$124;
          }

        }) | 0;
      }
    }, groupBy(function projection$$16(x$$95) {
      return x$$95.BonusType;
    }, map(function mapping$$44(x$$94) {
      return x$$94.BonusDamage;
    }, modificationArr, Array), Array, {
      Equals: equals,
      GetHashCode: structuralHash
    }), Int32Array), {
      GetZero() {
        return 0;
      },

      Add($x$$125, $y$$126) {
        return $x$$125 + $y$$126;
      }

    }) | 0;
    let totalDamage$$1;
    const x$$99 = damageRolls$$1 + sizeAdjustedWeaponDamage$$1.BonusDamage + modificationDamageBoni$$1 | 0;
    totalDamage$$1 = (x$$99 <= 0 ? urlAttack.WeaponDamage.NumberOfDie !== 0 : false) ? 1 : x$$99;
    let extraDamageOnHit$$1;

    const getDamageRolls$$5 = function getDamageRolls$$5(numberOfDie$$3, die$$13) {
      const rolledDice$$3 = rollDice$$1(1000, die$$13);
      return sum(ofSeq(delay(function () {
        return map$$1(function (i$$10) {
          return getRndArrElement$$1(rolledDice$$3);
        }, rangeNumber(1, 1, numberOfDie$$3));
      }), Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$127, $y$$128) {
          return $x$$127 + $y$$128;
        }

      }) | 0;
    };

    const extraDamageModifications$$2 = map(function mapping$$50(tupledArg$$34) {
      return [tupledArg$$34[0], String(tupledArg$$34[1])];
    }, (extraDmg$$5 = map(function mapping$$49(tupledArg$$31) {
      return [getDamageRolls$$5(tupledArg$$31[0].NumberOfDie, tupledArg$$31[0].Die), tupledArg$$31[0].DamageType, tupledArg$$31[1]];
    }, map(function mapping$$48(x$$100) {
      return [x$$100.ExtraDamage.OnHit, x$$100.Name];
    }, modificationArr, Array), Array), modifications$$1.some(function (modi$$2) {
      return (equals(modi$$2, VitalStrike) ? true : equals(modi$$2, VitalStrikeImproved)) ? true : equals(modi$$2, VitalStrikeGreater);
    }) === true ? (tupledArg$$33 = (tupledArg$$32 = (vitalS$$2 = head(sortByDescending(function projection$$17(x$$102) {
      return x$$102.ExtraDamage.OnHit.NumberOfDie;
    }, modifications$$1.filter(function (x$$101) {
      return equals(x$$101.ExtraDamage.OnHit.DamageType, new DamageTypes(12, "VitalStrikeDamage"));
    }), {
      Compare: comparePrimitives
    })), [ofSeq(delay(function () {
      return map$$1(function (i$$11) {
        return getDamageRolls$$5(sizeAdjustedWeaponDamage$$1.NumberOfDie, sizeAdjustedWeaponDamage$$1.Die);
      }, rangeNumber(1, 1, vitalS$$2.ExtraDamage.OnHit.NumberOfDie));
    }), Int32Array), vitalS$$2.Name]), [sum(tupledArg$$32[0], {
      GetZero() {
        return 0;
      },

      Add($x$$131, $y$$132) {
        return $x$$131 + $y$$132;
      }

    }), tupledArg$$32[1]]), append([[tupledArg$$33[0], new DamageTypes(12, "VitalStrikeDamage"), tupledArg$$33[1]]], extraDmg$$5, Array)) : extraDmg$$5), Array);
    extraDamageOnHit$$1 = extraDamageModifications$$2.filter(function predicate$$10(tupledArg$$35) {
      return tupledArg$$35[0] !== 0;
    });
    let extraDamageOnCrit$$1;

    const getDamageRolls$$6 = function getDamageRolls$$6(numberOfDie$$4, die$$14) {
      const rolledDice$$4 = rollDice$$1(1000, die$$14);
      return sum(ofSeq(delay(function () {
        return map$$1(function (i$$12) {
          return getRndArrElement$$1(rolledDice$$4);
        }, rangeNumber(1, 1, numberOfDie$$4));
      }), Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$133, $y$$134) {
          return $x$$133 + $y$$134;
        }

      }) | 0;
    };

    const extraDamageModifications$$3 = contains(patternInput$$1[0], urlAttack.CriticalRange, {
      Equals($x$$135, $y$$136) {
        return $x$$135 === $y$$136;
      },

      GetHashCode: structuralHash
    }) === false ? [] : map(function mapping$$53(tupledArg$$39) {
      return [tupledArg$$39[0], String(tupledArg$$39[1])];
    }, (extraDmg$$7 = map(function mapping$$52(tupledArg$$36) {
      return [getDamageRolls$$6(tupledArg$$36[0].NumberOfDie, tupledArg$$36[0].Die), tupledArg$$36[0].DamageType, tupledArg$$36[1]];
    }, map(function mapping$$51(x$$104) {
      return [x$$104.ExtraDamage.OnCrit, x$$104.Name];
    }, modificationArr, Array), Array), modifications$$1.some(function (modi$$3) {
      return (equals(modi$$3, VitalStrike) ? true : equals(modi$$3, VitalStrikeImproved)) ? true : equals(modi$$3, VitalStrikeGreater);
    }) === true ? (tupledArg$$38 = (tupledArg$$37 = (vitalS$$3 = head(sortByDescending(function projection$$18(x$$106) {
      return x$$106.ExtraDamage.OnHit.NumberOfDie;
    }, modifications$$1.filter(function (x$$105) {
      return equals(x$$105.ExtraDamage.OnHit.DamageType, new DamageTypes(12, "VitalStrikeDamage"));
    }), {
      Compare: comparePrimitives
    })), [ofSeq(delay(function () {
      return map$$1(function (i$$13) {
        return getDamageRolls$$6(sizeAdjustedWeaponDamage$$1.NumberOfDie, sizeAdjustedWeaponDamage$$1.Die);
      }, rangeNumber(1, 1, vitalS$$3.ExtraDamage.OnHit.NumberOfDie));
    }), Int32Array), vitalS$$3.Name]), [sum(tupledArg$$37[0], {
      GetZero() {
        return 0;
      },

      Add($x$$139, $y$$140) {
        return $x$$139 + $y$$140;
      }

    }), tupledArg$$37[1]]), append([[tupledArg$$38[0], new DamageTypes(12, "VitalStrikeDamage"), tupledArg$$38[1]]], extraDmg$$7, Array)) : extraDmg$$7), Array);
    extraDamageOnCrit$$1 = extraDamageModifications$$3.filter(function predicate$$11(tupledArg$$40) {
      return tupledArg$$40[0] !== 0;
    });
    let extraDamageCombined$$1;

    const getDamageRolls$$7 = function getDamageRolls$$7(numberOfDie$$5, die$$15) {
      const rolledDice$$5 = rollDice$$1(1000, die$$15);
      return sum(ofSeq(delay(function () {
        return map$$1(function (i$$14) {
          return getRndArrElement$$1(rolledDice$$5);
        }, rangeNumber(1, 1, numberOfDie$$5));
      }), Int32Array), {
        GetZero() {
          return 0;
        },

        Add($x$$141, $y$$142) {
          return $x$$141 + $y$$142;
        }

      }) | 0;
    };

    extraDamageCombined$$1 = equalsWith(compareArrays, extraDamageOnCrit$$1, []) ? append([[getDamageRolls$$7(urlAttack.ExtraDamage.NumberOfDie, urlAttack.ExtraDamage.Die), urlAttack.ExtraDamage.DamageType]], extraDamageOnHit$$1, Array).filter(function predicate$$12(tupledArg$$41) {
      return tupledArg$$41[0] !== 0;
    }) : append([[getDamageRolls$$7(urlAttack.ExtraDamage.NumberOfDie, urlAttack.ExtraDamage.Die), urlAttack.ExtraDamage.DamageType]], map2(function (onHit$$1, onCrit$$1) {
      return [onHit$$1[0] + onCrit$$1[0], onHit$$1[1]];
    }, extraDamageOnHit$$1, extraDamageOnCrit$$1, Array), Array).filter(function predicate$$13(tupledArg$$42) {
      return tupledArg$$42[0] !== 0;
    });

    const extraDamageToString$$1 = function extraDamageToString$$1(extraDmgArr$$1) {
      return trimEnd(fold(function folder$$1(strArr$$3, x$$108) {
        return strArr$$3 + x$$108;
      }, "", map(function mapping$$54(tupledArg$$43) {
        return "+" + int32ToString(tupledArg$$43[0]) + " " + tupledArg$$43[1] + " " + "damage" + ", ";
      }, extraDmgArr$$1, Array)), " ", ",");
    };

    const additionalInfoString$$1 = urlAttack.AdditionalEffects === "" ? "" : "plus " + urlAttack.AdditionalEffects;

    if (contains(patternInput$$1[0], urlAttack.CriticalRange, {
      Equals($x$$145, $y$$146) {
        return $x$$145 === $y$$146;
      },

      GetHashCode: structuralHash
    }) === false ? equalsWith(compareArrays, extraDamageCombined$$1, []) : false) {
      toConsole(printf("You attack with a %s and hit with a %i (rolled %i) for %i damage %s!"))(urlAttack.WeaponName)(totalAttackBonus$$1)(patternInput$$1[0])(totalDamage$$1)(additionalInfoString$$1);
    } else if (contains(patternInput$$1[0], urlAttack.CriticalRange, {
      Equals($x$$149, $y$$150) {
        return $x$$149 === $y$$150;
      },

      GetHashCode: structuralHash
    }) === true ? equalsWith(compareArrays, extraDamageCombined$$1, []) : false) {
      toConsole(printf("You attack with a %s and (hopefully) critically hit the enemy with a %i (rolled %i) and confirm your crit with a %i (rolled %i) for %i Damage (x %i) %s!"))(urlAttack.WeaponName)(totalAttackBonus$$1)(patternInput$$1[0])(totalAttackCritBonus$$1)(patternInput$$1[1])(totalDamage$$1)(urlAttack.CriticalModifier)(additionalInfoString$$1);
    } else if (contains(patternInput$$1[0], urlAttack.CriticalRange, {
      Equals($x$$153, $y$$154) {
        return $x$$153 === $y$$154;
      },

      GetHashCode: structuralHash
    }) === false ? !equalsWith(compareArrays, extraDamageCombined$$1, []) : false) {
      toConsole(printf("You attack with a %s and hit the enemy with a %i (rolled %i) for %i damage %s %s!"))(urlAttack.WeaponName)(totalAttackBonus$$1)(patternInput$$1[0])(totalDamage$$1)(extraDamageToString$$1(extraDamageCombined$$1))(additionalInfoString$$1);
    } else if (contains(patternInput$$1[0], urlAttack.CriticalRange, {
      Equals($x$$157, $y$$158) {
        return $x$$157 === $y$$158;
      },

      GetHashCode: structuralHash
    }) === true ? !equalsWith(compareArrays, extraDamageCombined$$1, []) : false) {
      toConsole(printf("You attack with a %s and (hopefully) critically hit the enemy with a %i (rolled %i) and confirm your crit with a %i (rolled %i) for %i damage (x %i) %s (%s on a crit) / (%s when not confirmed) !"))(urlAttack.WeaponName)(totalAttackBonus$$1)(patternInput$$1[0])(totalAttackCritBonus$$1)(patternInput$$1[1])(totalDamage$$1)(urlAttack.CriticalModifier)(additionalInfoString$$1)(extraDamageToString$$1(extraDamageCombined$$1))(extraDamageToString$$1(extraDamageOnHit$$1));
    } else {
      toConsole(printf("You should not see this message, please open an issue with your input as a bug report"));
    }
  };

  return mapIndexed(function mapping$$55(i$$15, tupledArg$$44) {
    calculateOneAttack(tupledArg$$44[0], tupledArg$$44[1], modificationsCombined[i$$15]);
  }, attackArr, Array);
}