export function googleCostRoughCalc(reqMonthly) {
  let cost = (7 / 1000) * reqMonthly;

  if (reqMonthly <= 100000) {
    cost += reqMonthly * (5 / 1000);
  } else if (reqMonthly <= 500000) {
    let level2 = reqMonthly - 100000;
    cost += 100000 * (5 / 1000) + level2 * (4 / 1000);
  } else {
    // cost = "+";
    // let level2 = reqMonthly - 100000;
    // cost += 100000 * (5 / 1000) + level2 * (4 / 1000);
    cost = null;
  }

  return cost;
}

export function mapboxCostRoughCalc(reqMonthly) {
  // Direction API cost plan
  const directionCostPlan = {
    100000: 0,
    500000: 2,
    1000000: 1.6,
    5000000: 1.2,
  };

  // == 500k
  const level1FullCost =
    ((Object.keys(directionCostPlan).at(1) -
      Object.keys(directionCostPlan).at(1)) /
      1000) *
    Object.values(directionCostPlan).at(1);

  // == 1M
  const level2FullCost =
    ((Object.keys(directionCostPlan).at(2) -
      Object.keys(directionCostPlan).at(1)) /
      1000) *
    Object.values(directionCostPlan).at(2);

  // == 5M
  const level3FullCost =
    ((Object.keys(directionCostPlan).at(3) -
      Object.keys(directionCostPlan).at(2)) /
      1000) *
    Object.values(directionCostPlan).at(3);

  let cost = 0;

  // Direction API cost calculation
  // <= 100k
  if (reqMonthly <= Object.keys(directionCostPlan).at(0)) {
    cost += 0;
  }
  // 100k ~ 500k
  else if (reqMonthly <= Object.keys(directionCostPlan).at(1)) {
    let level1 = (reqMonthly - Object.keys(directionCostPlan).at(0)) / 1000;
    cost += level1 * Object.values(directionCostPlan).at(1);
  }
  // 500k ~ 1M
  else if (reqMonthly <= Object.keys(directionCostPlan).at(2)) {
    let level2 = (reqMonthly - Object.keys(directionCostPlan).at(1)) / 1000;
    cost += level2 * Object.values(directionCostPlan).at(2) + level1FullCost;
  }
  // 1M ~ 5M
  else if (reqMonthly <= Object.keys(directionCostPlan).at(3)) {
    let level3 = (reqMonthly - Object.keys(directionCostPlan).at(2)) / 1000;
    cost +=
      level3 * Object.values(directionCostPlan).at(3) +
      level2FullCost +
      level1FullCost;
  }
  // > 5M
  else {
    cost = null;
    return cost;
  }

  // GL JS cost plan
  const glCostPlan = {
    50000: 0,
    100000: 5,
    200000: 4,
    1000000: 3,
  };

  // == 100k
  const glLevel1FullCost =
    ((Object.keys(glCostPlan).at(1) - Object.keys(glCostPlan).at(0)) / 1000) *
    Object.values(glCostPlan).at(1);

  // == 200k
  const glLevel2FullCost =
    ((Object.keys(glCostPlan).at(2) - Object.keys(glCostPlan).at(1)) / 1000) *
    Object.values(glCostPlan).at(2);

  // == 1M
  const glLevel3FullCost =
    ((Object.keys(glCostPlan).at(3) - Object.keys(glCostPlan).at(2)) / 1000) *
    Object.values(glCostPlan).at(3);

  // GL JS cost calculation
  // <= 50k
  if (reqMonthly <= Object.keys(glCostPlan).at(0)) {
    cost += 0;
  }
  // 50k ~ 100k
  else if (reqMonthly <= Object.keys(glCostPlan).at(1)) {
    let level1 = (reqMonthly - Object.keys(glCostPlan).at(0)) / 1000;
    cost += level1 * Object.values(glCostPlan).at(1);
  }
  // 100k ~ 200k
  else if (reqMonthly <= Object.keys(glCostPlan).at(2)) {
    let level2 = (reqMonthly - Object.keys(glCostPlan).at(1)) / 1000;
    cost += level2 * Object.values(glCostPlan).at(2) + glLevel1FullCost;
  }
  // 200k ~ 1M
  else if (reqMonthly <= Object.keys(glCostPlan).at(3)) {
    let level3 = (reqMonthly - Object.keys(glCostPlan).at(2)) / 1000;
    cost +=
      level3 * Object.values(glCostPlan).at(3) +
      glLevel2FullCost +
      glLevel1FullCost;
  }
  // > 1M
  else {
    cost = null;
  }

  return cost;
}
