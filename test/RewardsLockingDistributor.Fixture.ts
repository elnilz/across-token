import { getContractFactory, Contract, hre } from "./utils";
import { baseEmissionRate, maxMultiplier, secondsToMaxMultiplier, seedDistributorAmount } from "./constants";

export const rewardsLockingDistributorFixture = hre.deployments.createFixture(async ({ ethers }) => {
  const [deployerWallet] = await ethers.getSigners();

  const timer = await (await getContractFactory("Timer", deployerWallet)).deploy();

  const rewardToken = await (await getContractFactory("AcrossToken", deployerWallet)).deploy();

  const distributor = await (
    await getContractFactory("RewardsLockingDistributor", deployerWallet)
  ).deploy(rewardToken.address, timer.address);

  const lpToken1 = await (await getContractFactory("TestToken", deployerWallet)).deploy("LP1", "LP Token 1");
  const lpToken2 = await (await getContractFactory("TestToken", deployerWallet)).deploy("LP2", "LP Token 2");

  return { timer, rewardToken, distributor, lpToken1, lpToken2 };
});

export async function enableTokenForStaking(distributor: Contract, lpToken: Contract, rewardToken: Contract) {
  // Enable the LpToken for staking and deposit some across tokens into the distributor.
  await distributor.enableStaking(lpToken.address, true, baseEmissionRate, maxMultiplier, secondsToMaxMultiplier);
  await rewardToken.mint(distributor.address, seedDistributorAmount);
}