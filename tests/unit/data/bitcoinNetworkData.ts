import ecc from "@bitcoinerlab/secp256k1";
import { payments } from "bitcoinjs-lib";
import ECPairFactory from "ecpair";

const ECPair = ECPairFactory(ecc);
export const keysBuyer = ECPair.fromWIF(
  "L176AAx3VcF1PMMnSxwHZ9uuNNZtLq5B5cgA9v9T7x7sdw1pzhS2",
);
export const buyerAddress = payments.p2wpkh({
  pubkey: keysBuyer.publicKey,
}).address;
export const keysSeller = ECPair.fromWIF(
  "L1Bz4WbFsLd1Rc7FvSWXeHu7Qe161dA1EswbR5YHzckwYK5nEiYp",
);
export const sellerAddress = payments.p2wpkh({
  pubkey: keysSeller.publicKey,
}).address;

export const addresses = {
  bitcoin: [
    "bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3gkp6jxdd0vjcsdyspfxcv6",
    "12dRugNcdxK39288NjcDV4GX7rMsKCGn6B",
  ],
  testnet: [
    "tb1pwq9p5dj5577xr36e5xwc5gh93qw0qultf5vvqdkdr7q5umunesaque098t",
    "tb1qmqvdm66kfx8fnc7cqytsj6yp92ms6kames8lz4",
  ],
  regtest: [
    "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0",
    "bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngjkwcj5rg8qwpf9y6graadeqr7k9yu",
  ],
};
export const invalidAddresses = {
  bitcoin: [
    "bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3kp6jxdd0vjcsdyspfxcv6",
    "12dRugNcdxK39288NjcDV4G7rMsKCGn6B",
  ],
  testnet: [
    "tb1pwq9p5dj5577xr36e5xwc5gh9qw0qultf5vvqdkdr7q5umunesaque098t",
    "tb1qmqvdm66kfx8fnc7cqyts6yp92ms6kames8lz4",
  ],
  regtest: [
    "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd",
    "bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngkwcj5rg8qwpf9y6graadeqr7k9yu",
  ],
};

export const bitcoinTransactionHex =
  "0200000000010172c32d933343a2c28079c0e010c28d603fd1a9a95a006a94fa788ff96a582ecf0000000000000000000248020f000000000016001490407e720f8d865b62eac8e2c62e355952648c02983a0000000000001600141a4c3d16409dddc499160230dc84a1182b2ab38e04483045022100d46d8d5fdcd10e747ae1fb67a1c89914b6311b93b95a520d76f895b629868c66022023230dcdd1dfd84fd7884553e89d0358193456d3027e770092d78db93381bffe01483045022100fdee50bcc847526bad984708b1420b5d18cc4b187ef0924a4861e4a66a9b1e240220671d85731d02ff10b38d8d7c87343b56b73a1eb3e3a607e2a2adfebb0a26619c01004e6302e010b275672102e82ecc3ab700832d5ac61624078b72307c9b7d7906d4790eea868bb167808fddad682103dfca2633400c19abe56584182a442d1affba5227404896969ac51213ad0adb6cac00000000";
export const isValidReleaseTransaction =
  "02000000000101dff9f0ca75e1df27875fa06b0f24985a50203f75225cff96bcab675845db51780000000000000000000248020f000000000016001490407e720f8d865b62eac8e2c62e355952648c02983a000000000000160014e053dd4b3c878f37f06a3f7933a43bf751f92bb404483045022100d028ebba8006dc682422576e721eae1ac5a6bdf0deae1c53a6bec081b67a4dc102204d3782a12ada427aa36785707fa12fdf6beb400c2002706e34907cfa424df26a0147304402204a30ef99b03cd635cca40debdf704d248b9ca2cf46b04359a8f52e6082e0f80d022004ef69c3737ca42df0a702f2394d39073adf0f0d45680186b0d82188a78b580b01004e6302e010b275672102e82ecc3ab700832d5ac61624078b72307c9b7d7906d4790eea868bb167808fddad682102991988e3a66420f66dda0ea5c157b5d87d761aa883146b20827c129c3fce219bac00000000";

export const refundPSBT =
  "cHNidP8BAFICAAAAAd/58Mp14d8nh1+gaw8kmFpQID91Ilz/lryrZ1hF21F4AAAAAAAAAAAAAadADwAAAAAAFgAU0X0GD+b7kN56NACogkLJ7epN+qQAAAAAAAEBK0BCDwAAAAAAIgAgudpNm/aL3iFFBhkNv8G7qrdDXiFaiannphPfG3gsKssiAgMuX8osW7YUBMvKo/e4I3y331vHbWdcOQkJmOOCP87PZUcwRAIgffG/NTM9UWh98ukY90R7W68IsWm2kbKtbw7bD7Fg/LICIDTdnE0RLmGV1ho2yS4xxmG7O+a06QJ7ljXrjs0AgLV3AQEDBAEAAAABBU5jAhkCsnVnIQOp6o2AAHMfgCh7Q6+Z8oKUuB7gEaW95d/SvrbAP242gq1oIQMuX8osW7YUBMvKo/e4I3y331vHbWdcOQkJmOOCP87PZawAAA==";

export const estimatedFees = {
  fastestFee: 21,
  halfHourFee: 6,
  hourFee: 4,
  economyFee: 2,
  minimumFee: 2,
};
