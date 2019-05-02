import { getMonsterInformation } from "./Reader";
import { calculateFullAttack, calculateStandardAttack } from "./Calculator";
export function reader(baseString) {
  return getMonsterInformation(baseString);
}
export function calculatorStandard(readerInfo, attackvariant, attacknumber, modifications) {
  calculateStandardAttack(readerInfo, attackvariant, attacknumber, modifications);
}
export function calculatorFull(readerInfo$$1, attackvariant$$1, attacknumber$$1, modifications$$1) {
  return calculateFullAttack(readerInfo$$1, attackvariant$$1, attacknumber$$1, modifications$$1);
}