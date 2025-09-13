// test/DonationBox.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationBox", function () {
  async function deployFixture() {
    const [owner, donor1, donor2, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("DonationBox");
    const donationBox = await Factory.deploy();
    await donationBox.waitForDeployment();
    return { owner, donor1, donor2, stranger, donationBox };
  }

  it("initializes with owner and zero totals", async () => {
    const { owner, donationBox } = await deployFixture();
    expect(await donationBox.owner()).to.equal(owner.address);
    expect(await donationBox.totalDonations()).to.equal(0n);
    expect(await donationBox.getContractBalance()).to.equal(0n);
  });

  it("accepts donations and emits event", async () => {
    const { donor1, donationBox } = await deployFixture();
    const amount = ethers.parseEther("0.1");
    await expect(donationBox.connect(donor1).donate({ value: amount }))
      .to.emit(donationBox, "DonationReceived")
      .withArgs(donor1.address, amount);

    expect(await donationBox.totalDonations()).to.equal(amount);
    expect(await donationBox.getContractBalance()).to.equal(amount);
  });

  it("reverts zero donation", async () => {
    const { donor1, donationBox } = await deployFixture();
    await expect(donationBox.connect(donor1).donate({ value: 0 }))
      .to.be.revertedWith("Donation amount must be greater than zero.");
  });

  it("only owner can withdraw", async () => {
    const { donor1, stranger, donationBox } = await deployFixture();
    const amount = ethers.parseEther("0.2");
    await donationBox.connect(donor1).donate({ value: amount });

    await expect(donationBox.connect(stranger).withdraw())
      .to.be.revertedWith("Only owner can call this function.");
  });

  it("withdraw transfers funds to owner and resets total", async () => {
    const { owner, donor1, donationBox } = await deployFixture();
    const amount1 = ethers.parseEther("0.15");
    const amount2 = ethers.parseEther("0.05");
    await donationBox.connect(donor1).donate({ value: amount1 });
    await donationBox.connect(donor1).donate({ value: amount2 });

    const start = await ethers.provider.getBalance(owner.address);
    const tx = await donationBox.connect(owner).withdraw();
    const rcpt = await tx.wait();
    const gas = rcpt.gasUsed * rcpt.gasPrice;

    const end = await ethers.provider.getBalance(owner.address);
    expect(end).to.equal(start + amount1 + amount2 - gas);
    expect(await donationBox.totalDonations()).to.equal(0n);
    expect(await donationBox.getContractBalance()).to.equal(0n);
  });

  it("reverts withdraw when nothing to withdraw", async () => {
    const { owner, donationBox } = await deployFixture();
    await expect(donationBox.connect(owner).withdraw())
      .to.be.revertedWith("There are no money to withdraw.");
  });
});
