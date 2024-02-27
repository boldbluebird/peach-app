/* eslint-disable no-magic-numbers */
import { Psbt, networks } from "bitcoinjs-lib";
import { ElementsValue, networks as liquidNetworks } from "liquidjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import {
  asset,
  liquidAddresses,
} from "../../../tests/unit/data/liquidNetworkData";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { SIGHASH } from "../bitcoin/constants";
import { getEscrowWalletForOffer } from "../wallet/getEscrowWalletForOffer";
import { setWallet } from "../wallet/setWallet";
import { verifyAndSignReleaseTx } from "./verifyAndSignReleaseTx";

const fromBase64Mock = jest.spyOn(Psbt, "fromBase64");
const fromBase64LiquidMock = jest.spyOn(LiquidPsbt, "fromBase64");

const verifyReleasePSBTMock = jest.fn();
jest.mock("../../views/contract/helpers/verifyReleasePSBT", () => ({
  verifyReleasePSBT: (...args: unknown[]) => verifyReleasePSBTMock(...args),
}));

describe("verifyAndSignReleaseTx", () => {
  const amount = 10000;
  const mockSellOffer = {
    id: "12",
    funding: { txIds: ["txid1"], vouts: [0], amounts: [amount] },
    amount,
  };
  const mockContract: Partial<Contract> = {
    id: "12-13",
    symmetricKeyEncrypted: "mockSymmetricKeyEncrypted",
    symmetricKeySignature: "mockSymmetricKeySignature",
    buyer: { id: "mockBuyerId", pgpPublicKey: "mockPgpPublicKey" } as User,
    seller: { id: "mockSellerId" } as User,
    releasePsbt: "releasePsbt",
  };
  const contractWithBatching = {
    ...mockContract,
    batchReleasePsbt: "batchReleasePsbt",
  };
  const finalizeInputMock = jest.fn();

  const psbt: Partial<Psbt> = {
    ...new Psbt(),
    data: { inputs: [{ sighashType: SIGHASH.ALL }] } as Psbt["data"],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    extractTransaction: jest.fn().mockReturnValue({
      toHex: jest.fn().mockReturnValue("transactionAsHex"),
    }),
    txInputs: [{}] as Psbt["txInputs"],
    txOutputs: [
      { address: "address1", value: 9000 },
      { address: "address2", value: 1000 },
    ] as Psbt["txOutputs"],
  };
  const liquidPsbt: Partial<LiquidPsbt> = {
    ...new LiquidPsbt(),
    data: { inputs: [{ sighashType: SIGHASH.ALL }] } as LiquidPsbt["data"],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    extractTransaction: jest.fn().mockReturnValue({
      toHex: jest.fn().mockReturnValue("transactionAsHex"),
    }),
    txInputs: [{}] as Psbt["txInputs"],
    txOutputs: [
      {
        address: "address1",
        value: ElementsValue.fromNumber(9000).bytes,
        asset: asset.regtest,
        nonce: Buffer.from("00", "hex"),
        script: Buffer.from("00", "hex"),
      },
      {
        address: "address2",
        value: ElementsValue.fromNumber(1000).bytes,
        asset: asset.regtest,
        nonce: Buffer.from("00", "hex"),
        script: Buffer.from("00", "hex"),
      },
    ] as LiquidPsbt["txOutputs"],
  };
  const batchPsbt: Partial<Psbt> = {
    data: {
      inputs: [{ sighashType: SIGHASH.SINGLE_ANYONECANPAY }],
    } as Psbt["data"],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    toBase64: jest.fn().mockReturnValue("batchTransactionAsBase64"),
    txInputs: [{}] as Psbt["txInputs"],
    txOutputs: [{ address: "address1", value: 9000 }] as Psbt["txOutputs"],
  };
  fromBase64Mock.mockImplementation((base64) =>
    base64 === mockContract.releasePsbt ? (psbt as Psbt) : (batchPsbt as Psbt),
  );
  fromBase64LiquidMock.mockReturnValue(liquidPsbt as LiquidPsbt);
  setWallet(createTestWallet());

  const wallet = getEscrowWalletForOffer(mockSellOffer as SellOffer);

  it("should return null and error message if sell offer id is found", () => {
    const { error } = verifyAndSignReleaseTx(
      mockContract as Contract,
      {} as SellOffer,
      wallet,
    );
    expect(error).toBe("SELL_OFFER_NOT_FOUND");
  });
  it("should return null and error message if sell offer funding is found", () => {
    const { error } = verifyAndSignReleaseTx(
      mockContract as Contract,
      { ...mockSellOffer, funding: undefined } as unknown as SellOffer,
      wallet,
    );
    expect(error).toBe("SELL_OFFER_NOT_FOUND");
  });
  it("should return null and error message if psbt is not valid", () => {
    verifyReleasePSBTMock.mockReturnValueOnce("INVALID_INPUT");

    const { result, error } = verifyAndSignReleaseTx(
      mockContract as Contract,
      mockSellOffer as SellOffer,
      wallet,
    );

    expect(result?.releaseTransaction).toBe(undefined);
    expect(result?.batchReleasePsbt).toBe(undefined);
    expect(error).toBe("INVALID_INPUT");
  });
  it("should sign valid release transaction and return it", () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    const { result, error } = verifyAndSignReleaseTx(
      mockContract as Contract,
      mockSellOffer as SellOffer,
      wallet,
    );

    expect(error).toBe(undefined);
    expect(result?.releaseTransaction).toEqual("transactionAsHex");
    expect(result?.batchReleasePsbt).toEqual(undefined);
    expect(psbt.signInput).toHaveBeenCalled();
    expect(fromBase64Mock).toHaveBeenCalledWith(mockContract.releasePsbt, {
      network: networks.regtest,
    });
    expect(finalizeInputMock).toHaveBeenCalled();
    expect(psbt.extractTransaction).toHaveBeenCalled();
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled();
  });
  it("should sign valid liquid release transaction and return it", () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    const { result, error } = verifyAndSignReleaseTx(
      {
        ...mockContract,
        releaseAddress: liquidAddresses.regtest[0],
      } as Contract,
      mockSellOffer as SellOffer,
      wallet,
    );

    expect(error).toBe(undefined);
    expect(result?.releaseTransaction).toEqual("transactionAsHex");
    expect(result?.batchReleasePsbt).toEqual(undefined);
    expect(liquidPsbt.signInput).toHaveBeenCalled();
    expect(fromBase64LiquidMock).toHaveBeenCalledWith(
      mockContract.releasePsbt,
      {
        network: liquidNetworks.regtest,
      },
    );
    expect(finalizeInputMock).toHaveBeenCalled();
    expect(liquidPsbt.extractTransaction).toHaveBeenCalled();
    expect(liquidPsbt.extractTransaction?.().toHex).toHaveBeenCalled();
  });
  it("should return null and error message if batch psbt is not valid", () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    verifyReleasePSBTMock.mockReturnValueOnce("INVALID_INPUT");

    const { result, error } = verifyAndSignReleaseTx(
      contractWithBatching as Contract,
      mockSellOffer as SellOffer,
      wallet,
    );

    expect(result?.releaseTransaction).toBe(undefined);
    expect(result?.batchReleasePsbt).toBe(undefined);
    expect(error).toBe("INVALID_INPUT");
  });
  it("should return null and error message if batch psbt is valid but not for batching", () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    fromBase64Mock.mockReturnValueOnce(psbt as Psbt);
    fromBase64Mock.mockReturnValueOnce(psbt as Psbt);

    const { result, error } = verifyAndSignReleaseTx(
      contractWithBatching as Contract,
      mockSellOffer as SellOffer,
      wallet,
    );

    expect(result?.releaseTransaction).toBe(undefined);
    expect(result?.batchReleasePsbt).toBe(undefined);
    expect(error).toBe("Transaction is not for batching");
  });
  it("should sign release transaction and batch release transaction", () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    const { result, error } = verifyAndSignReleaseTx(
      contractWithBatching as Contract,
      mockSellOffer as SellOffer,
      wallet,
    );

    expect(error).toBe(undefined);
    expect(result?.releaseTransaction).toEqual("transactionAsHex");
    expect(result?.batchReleasePsbt).toEqual("batchTransactionAsBase64");
    expect(psbt.signInput).toHaveBeenCalled();
  });
});
