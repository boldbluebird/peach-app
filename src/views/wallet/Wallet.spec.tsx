/* eslint-disable no-magic-numbers */
import { LocalUtxo, OutPoint, TxOut } from "bdk-rn/lib/classes/Bindings";
import { Script } from "bdk-rn/lib/classes/Script";
import { KeychainKind } from "bdk-rn/lib/lib/enums";
import { fireEvent, render, waitFor } from "test-utils";
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import {
  navigateMock,
  setRouteMock,
} from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import { Wallet } from "./Wallet";

const defaultReturnValue = {
  balance: 21,
};
const useWalletBalanceMock = jest.fn(() => defaultReturnValue);
jest.mock("./hooks/useWalletBalance", () => ({
  useWalletBalance: () => useWalletBalanceMock(),
}));

const addresses = {
  first: {
    address: "firstAddress",
    used: true,
    index: 0,
  },
  second: {
    address: "secondAddress",
    used: true,
    index: 1,
  },
  previous: {
    address: "previousAddress",
    used: true,
    index: 20,
  },
  lastUnused: {
    address: "lastUnusedAddress",
    used: false,
    index: 21,
  },
  next: {
    address: "nextAddress",
    used: false,
    index: 22,
  },
};

jest.useFakeTimers();

const outpoint = new OutPoint(confirmed1.txid, 0);
const amount = 10000;
const txOut = new TxOut(amount, new Script("address"));
const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External);
const listUnspentMock = jest.fn().mockResolvedValue([utxo]);

describe("Wallet", () => {
  beforeAll(() => {
    setRouteMock({
      name: "homeScreen",
      key: "homeScreen",
      params: { screen: "wallet" },
    });
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    peachWallet.getAddressByIndex = jest.fn((index: number) => {
      if (index === 0) return Promise.resolve(addresses.first);
      if (index === 1) return Promise.resolve(addresses.second);
      if (index === 20) return Promise.resolve(addresses.previous);
      if (index === 21) return Promise.resolve(addresses.lastUnused);
      if (index === 22) return Promise.resolve(addresses.next);
      throw new Error("Invalid index");
    });
    peachWallet.initialized = true;
    peachWallet.getLastUnusedAddress = jest.fn(() =>
      Promise.resolve({
        ...addresses.lastUnused,
        keychain: KeychainKind.Internal,
      }),
    );
    if (peachWallet.wallet) {
      peachWallet.wallet.listUnspent = listUnspentMock;
    }
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("should render correctly", async () => {
    const { toJSON } = render(<Wallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it("should render correctly when loading", () => {
    const { toJSON } = render(<Wallet />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should navigate to send screen when send button is pressed", async () => {
    const { getByText } = render(<Wallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    fireEvent.press(getByText("send"));

    expect(navigateMock).toHaveBeenCalledWith("sendBitcoin");
  });
  it("should navigate to receive screen when receive button is pressed", async () => {
    const { getByText } = render(<Wallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("receive"));

    expect(navigateMock).toHaveBeenCalledWith("receiveBitcoin");
  });
  it("should prefetch addresses", async () => {
    render(<Wallet />);

    await waitFor(() => {
      expect(
        queryClient.getQueriesData({ queryKey: ["receiveAddress"] }),
      ).toEqual([
        [["receiveAddress", 0], addresses.first],
        [["receiveAddress", 1], addresses.second],
        [["receiveAddress", -1], undefined],
        [["receiveAddress", 21], addresses.lastUnused],
        [["receiveAddress", 22], addresses.next],
        [["receiveAddress", 20], addresses.previous],
      ]);
    });
  });
  it("should prefetch utxos", async () => {
    render(<Wallet />);

    await waitFor(() => {
      expect(queryClient.getQueryData(["utxos"])).toEqual([utxo]);
    });
  });
});
