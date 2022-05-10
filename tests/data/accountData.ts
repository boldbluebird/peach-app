/* eslint-disable max-len */
export const buyOffer: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '37',
  online: true,
  type: 'bid',
  currencies: ['EUR', 'CHF'],
  paymentMethods: ['iban'],
  kyc: false,
  amount: 250000,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const sellOffer: SellOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '38',
  online: true,
  type: 'ask',
  currencies: ['EUR'],
  paymentData: [
    {
      id: 'iban',
      type: 'iban',
      selected: true
    }
  ],
  paymentMethods: ['iban'],
  kyc: false,
  amount: 250000,
  premium: 1.5,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  returnAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  refunded: false,
  released: false,
}
export const buyOfferUnpublished: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  type: 'bid',
  online: false,
  currencies: ['EUR', 'CHF'],
  paymentMethods: ['iban'],
  kyc: false,
  amount: 250000,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const recoveredAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
  contracts: [],
  chats: {},
  pgp: {
    privateKey: '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: openpgp-mobile\n\n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\n=Ik21\n-----END PGP PRIVATE KEY BLOCK-----',
    publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: openpgp-mobile\n\nxsBNBGIyIM8BCAC/FTDaVmJ1kvkEF7Zv0kbQNgYmNMux0aGQMwA9fOA1Cvp/HPmL\nlD3Yuy2FQt3zMPZS5nimCWprs5HeuTONf2BQApFBtXrScwDnWvwAIP6Ldbf6XtH6\nFcxx5z4oROtgyKy11McS6T50UD9Ebp7wh/KR7c3cloxH54ADefYU5McWX0+ppCpy\nfZh+VIxvNBGALe1jqmQU/3TyCZKBAJ8Z2TuQqfZ+eMK7GvGJoll0DERfVbvPh4vj\n9SJ0wmRdrfD50s+a1v5s59/FHvSadk7Zun0G8G9tteTTTx+ghfOSR6Bhpbmsirr/\nAuvI0u8sT+tN/FQwJUBj8BT8EDWeU7WvvIVVABEBAAHNAMLAaAQTAQgAHAUCYjIg\nzwkQwtevQuBWmE0CGwMCGQECCwcCFQgAAOipCAB8x52lwTA6f0FOgoIfZTN+6ve9\nZH6W305ZK/ZyYn9KE9ubruyPxZj0LTClhK/jnxmmrYDmUZdapGFhraQb3wUFCFJc\nN5f+LGOHgqDvtfa0GfN8LwmYXMNAkfShzI3gJU4AqDfFv+9BuQkORpWYPF7eXZtl\nuvNsgQ2ezsGbSOvu5OtWIeaJBIBkJlkbS/UAh+Hrj1STsZxHCS7dhnePnWOMh/ES\nrGyp0T5Ep04TvhbrVV2sJYG95wehbGdqMtphXPKrX1tdn8hVhz17j6k7s+4z6GMS\nzXd5szk51rd8MMihGwHObiCf/j1wpvPc1JNmjMO2bEJ68lDSUNPSpcDwgJD2zsBN\nBGIyIM8BCADa+yXuWO0Nq1TJC73ATaUQL9U31VAeZe/bxr+Mf/pW1pABAb9rZGGN\nscP9jKUiJZPFfQCK3W3nu2XjRwKI6F7jlCwLGm+sDPhMURw3QI006s6pbeIJq1vo\nFlj94gMzsyIkuEf4tdKkWNtygbltD5g/1ZoO75vIDbf/E8P44G+JuLG6UV4gf40d\noNuQFuLgpOx8bWHy2Ev5Zcs4RhtMCQhQ1KUNZWBmR7zIvXbuJFUww68bznVL4SJY\nvbYTX/8TboeTYBN/Vp+d1NocTfO8h5ikdGxILyiKZiV/wguXd9nIR0KdI+8++sIT\nRnjuqmKYZwG0GMbwnCkdz2HkF/bYgd+JABEBAAHCwF8EGAEIABMFAmIyIM8JEMLX\nr0LgVphNAhsMAADDuggAX6EyWbfc1Ti2GCogyrUIp+2nh6IqVzG0CtqANBGUA9re\n60U+NrgXzffcZ+yrFYL6cT0C2XAutpP0o1wfUnsl19FMIPc6JOej7GOzew2flcuR\nRdxps7nqP00F2tce9hu+BugxW6K7bAnmxlq8K6n7/oZXsS1SJejl3pEFB0l4bIRL\ncp/Ql17hvtYLjb3qBNURS+Iu2GHsLZHJGpG50VQBk2kiVS0RjN17GiOejTs+Hb+4\nLEW3cv+Lk1RHAThlxX3XGQgU6M28ncS8Xs3WrqMk97nNYg8+xDX8YAqUZLa+kkYL\nApar4GBPVjEMVuNjtPfgC9PtIhFhnK3BFX7VZaCs3Q==\n=/EpH\n-----END PGP PUBLIC KEY BLOCK-----'
  },
  publicKey: '03a9ea8d8000731f80287b43af99f28294b81ee011a5bde5dfd2beb6c03f6e3682',
  privKey: '80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5',
  mnemonic: 'genuine all body calm mirror van apple lady train inhale evolve essay',
}

export const account1: Account = {
  settings: {
    skipTutorial: true,
    amount: 1000000,
    currencies: ['EUR', 'CHF'],
    paymentMethods: ['iban'],
    kyc: false
  },
  paymentData: [],
  tradingLimit: {
    daily: 0,
    dailyAmount: 1000,
    yearly: 0,
    yearlyAmount: 100000,
  },
  offers: [
    buyOffer,
    sellOffer,
    buyOfferUnpublished,
  ],
  contracts: [],
  chats: {},
  pgp: {
    privateKey: '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: openpgp-mobile\n\n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\n=Ik21\n-----END PGP PRIVATE KEY BLOCK-----',
    publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: openpgp-mobile\n\nxsBNBGIyIM8BCAC/FTDaVmJ1kvkEF7Zv0kbQNgYmNMux0aGQMwA9fOA1Cvp/HPmL\nlD3Yuy2FQt3zMPZS5nimCWprs5HeuTONf2BQApFBtXrScwDnWvwAIP6Ldbf6XtH6\nFcxx5z4oROtgyKy11McS6T50UD9Ebp7wh/KR7c3cloxH54ADefYU5McWX0+ppCpy\nfZh+VIxvNBGALe1jqmQU/3TyCZKBAJ8Z2TuQqfZ+eMK7GvGJoll0DERfVbvPh4vj\n9SJ0wmRdrfD50s+a1v5s59/FHvSadk7Zun0G8G9tteTTTx+ghfOSR6Bhpbmsirr/\nAuvI0u8sT+tN/FQwJUBj8BT8EDWeU7WvvIVVABEBAAHNAMLAaAQTAQgAHAUCYjIg\nzwkQwtevQuBWmE0CGwMCGQECCwcCFQgAAOipCAB8x52lwTA6f0FOgoIfZTN+6ve9\nZH6W305ZK/ZyYn9KE9ubruyPxZj0LTClhK/jnxmmrYDmUZdapGFhraQb3wUFCFJc\nN5f+LGOHgqDvtfa0GfN8LwmYXMNAkfShzI3gJU4AqDfFv+9BuQkORpWYPF7eXZtl\nuvNsgQ2ezsGbSOvu5OtWIeaJBIBkJlkbS/UAh+Hrj1STsZxHCS7dhnePnWOMh/ES\nrGyp0T5Ep04TvhbrVV2sJYG95wehbGdqMtphXPKrX1tdn8hVhz17j6k7s+4z6GMS\nzXd5szk51rd8MMihGwHObiCf/j1wpvPc1JNmjMO2bEJ68lDSUNPSpcDwgJD2zsBN\nBGIyIM8BCADa+yXuWO0Nq1TJC73ATaUQL9U31VAeZe/bxr+Mf/pW1pABAb9rZGGN\nscP9jKUiJZPFfQCK3W3nu2XjRwKI6F7jlCwLGm+sDPhMURw3QI006s6pbeIJq1vo\nFlj94gMzsyIkuEf4tdKkWNtygbltD5g/1ZoO75vIDbf/E8P44G+JuLG6UV4gf40d\noNuQFuLgpOx8bWHy2Ev5Zcs4RhtMCQhQ1KUNZWBmR7zIvXbuJFUww68bznVL4SJY\nvbYTX/8TboeTYBN/Vp+d1NocTfO8h5ikdGxILyiKZiV/wguXd9nIR0KdI+8++sIT\nRnjuqmKYZwG0GMbwnCkdz2HkF/bYgd+JABEBAAHCwF8EGAEIABMFAmIyIM8JEMLX\nr0LgVphNAhsMAADDuggAX6EyWbfc1Ti2GCogyrUIp+2nh6IqVzG0CtqANBGUA9re\n60U+NrgXzffcZ+yrFYL6cT0C2XAutpP0o1wfUnsl19FMIPc6JOej7GOzew2flcuR\nRdxps7nqP00F2tce9hu+BugxW6K7bAnmxlq8K6n7/oZXsS1SJejl3pEFB0l4bIRL\ncp/Ql17hvtYLjb3qBNURS+Iu2GHsLZHJGpG50VQBk2kiVS0RjN17GiOejTs+Hb+4\nLEW3cv+Lk1RHAThlxX3XGQgU6M28ncS8Xs3WrqMk97nNYg8+xDX8YAqUZLa+kkYL\nApar4GBPVjEMVuNjtPfgC9PtIhFhnK3BFX7VZaCs3Q==\n=/EpH\n-----END PGP PUBLIC KEY BLOCK-----'
  },
  publicKey: '03a9ea8d8000731f80287b43af99f28294b81ee011a5bde5dfd2beb6c03f6e3682',
  privKey: '80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5',
  mnemonic: 'genuine all body calm mirror van apple lady train inhale evolve essay',
}

export const paymentData: PaymentData[] = [
  {
    'beneficiary': 'Melocoton',
    'iban': 'IE29 AIBK 9311 5212 3456 78',
    'id': 'iban-IE29AIBK93115212345678',
    'selected': true,
    'type': 'iban'
  }, {
    'beneficiary': 'Test',
    'iban': 'EE38 2200 2210 2014 5685',
    'id': 'iban-EE382200221020145685',
    'type': 'iban'
  }
]

export const contract: Contract = {
  amount: 250000,
  buyer: {
    id: '02adcf3c857078dc3ca7064a49d20c6ae4978809057ffb75dc0750d8b5020aafe9',
    creationDate: new Date(),
    trades: 0,
    rating: 0,
    userRating: 0,
    ratingCount: 0,
    peachRating: 0,
    medals: [],
    pgpPublicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: openpgp-mobile\n\nxsBNBGIyIM8BCAC/FTDaVmJ1kvkEF7Zv0kbQNgYmNMux0aGQMwA9fOA1Cvp/HPmL\nlD3Yuy2FQt3zMPZS5nimCWprs5HeuTONf2BQApFBtXrScwDnWvwAIP6Ldbf6XtH6\nFcxx5z4oROtgyKy11McS6T50UD9Ebp7wh/KR7c3cloxH54ADefYU5McWX0+ppCpy\nfZh+VIxvNBGALe1jqmQU/3TyCZKBAJ8Z2TuQqfZ+eMK7GvGJoll0DERfVbvPh4vj\n9SJ0wmRdrfD50s+a1v5s59/FHvSadk7Zun0G8G9tteTTTx+ghfOSR6Bhpbmsirr/\nAuvI0u8sT+tN/FQwJUBj8BT8EDWeU7WvvIVVABEBAAHNAMLAaAQTAQgAHAUCYjIg\nzwkQwtevQuBWmE0CGwMCGQECCwcCFQgAAOipCAB8x52lwTA6f0FOgoIfZTN+6ve9\nZH6W305ZK/ZyYn9KE9ubruyPxZj0LTClhK/jnxmmrYDmUZdapGFhraQb3wUFCFJc\nN5f+LGOHgqDvtfa0GfN8LwmYXMNAkfShzI3gJU4AqDfFv+9BuQkORpWYPF7eXZtl\nuvNsgQ2ezsGbSOvu5OtWIeaJBIBkJlkbS/UAh+Hrj1STsZxHCS7dhnePnWOMh/ES\nrGyp0T5Ep04TvhbrVV2sJYG95wehbGdqMtphXPKrX1tdn8hVhz17j6k7s+4z6GMS\nzXd5szk51rd8MMihGwHObiCf/j1wpvPc1JNmjMO2bEJ68lDSUNPSpcDwgJD2zsBN\nBGIyIM8BCADa+yXuWO0Nq1TJC73ATaUQL9U31VAeZe/bxr+Mf/pW1pABAb9rZGGN\nscP9jKUiJZPFfQCK3W3nu2XjRwKI6F7jlCwLGm+sDPhMURw3QI006s6pbeIJq1vo\nFlj94gMzsyIkuEf4tdKkWNtygbltD5g/1ZoO75vIDbf/E8P44G+JuLG6UV4gf40d\noNuQFuLgpOx8bWHy2Ev5Zcs4RhtMCQhQ1KUNZWBmR7zIvXbuJFUww68bznVL4SJY\nvbYTX/8TboeTYBN/Vp+d1NocTfO8h5ikdGxILyiKZiV/wguXd9nIR0KdI+8++sIT\nRnjuqmKYZwG0GMbwnCkdz2HkF/bYgd+JABEBAAHCwF8EGAEIABMFAmIyIM8JEMLX\nr0LgVphNAhsMAADDuggAX6EyWbfc1Ti2GCogyrUIp+2nh6IqVzG0CtqANBGUA9re\n60U+NrgXzffcZ+yrFYL6cT0C2XAutpP0o1wfUnsl19FMIPc6JOej7GOzew2flcuR\nRdxps7nqP00F2tce9hu+BugxW6K7bAnmxlq8K6n7/oZXsS1SJejl3pEFB0l4bIRL\ncp/Ql17hvtYLjb3qBNURS+Iu2GHsLZHJGpG50VQBk2kiVS0RjN17GiOejTs+Hb+4\nLEW3cv+Lk1RHAThlxX3XGQgU6M28ncS8Xs3WrqMk97nNYg8+xDX8YAqUZLa+kkYL\nApar4GBPVjEMVuNjtPfgC9PtIhFhnK3BFX7VZaCs3Q==\n=/EpH\n-----END PGP PUBLIC KEY BLOCK-----',
    pgpPublicKeyProof: '45a32da3eaaf89803af0cf6f13d68518147ca48c170f3d30a7fe38610513115e0bc73a9d6ea4e3d866014478e576baddfb705a0a36367fe11b8732c47f0b9c8f',
  },
  seller: {
    id: '02adcf3c857078dc3ca7064a49d20c6ae4978809057ffb75dc0750d8b5020aafe9',
    creationDate: new Date(),
    trades: 0,
    rating: 0,
    userRating: 0,
    ratingCount: 0,
    peachRating: 0,
    medals: [],
    pgpPublicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: openpgp-mobile\n\nxsBNBGIyIM8BCAC/FTDaVmJ1kvkEF7Zv0kbQNgYmNMux0aGQMwA9fOA1Cvp/HPmL\nlD3Yuy2FQt3zMPZS5nimCWprs5HeuTONf2BQApFBtXrScwDnWvwAIP6Ldbf6XtH6\nFcxx5z4oROtgyKy11McS6T50UD9Ebp7wh/KR7c3cloxH54ADefYU5McWX0+ppCpy\nfZh+VIxvNBGALe1jqmQU/3TyCZKBAJ8Z2TuQqfZ+eMK7GvGJoll0DERfVbvPh4vj\n9SJ0wmRdrfD50s+a1v5s59/FHvSadk7Zun0G8G9tteTTTx+ghfOSR6Bhpbmsirr/\nAuvI0u8sT+tN/FQwJUBj8BT8EDWeU7WvvIVVABEBAAHNAMLAaAQTAQgAHAUCYjIg\nzwkQwtevQuBWmE0CGwMCGQECCwcCFQgAAOipCAB8x52lwTA6f0FOgoIfZTN+6ve9\nZH6W305ZK/ZyYn9KE9ubruyPxZj0LTClhK/jnxmmrYDmUZdapGFhraQb3wUFCFJc\nN5f+LGOHgqDvtfa0GfN8LwmYXMNAkfShzI3gJU4AqDfFv+9BuQkORpWYPF7eXZtl\nuvNsgQ2ezsGbSOvu5OtWIeaJBIBkJlkbS/UAh+Hrj1STsZxHCS7dhnePnWOMh/ES\nrGyp0T5Ep04TvhbrVV2sJYG95wehbGdqMtphXPKrX1tdn8hVhz17j6k7s+4z6GMS\nzXd5szk51rd8MMihGwHObiCf/j1wpvPc1JNmjMO2bEJ68lDSUNPSpcDwgJD2zsBN\nBGIyIM8BCADa+yXuWO0Nq1TJC73ATaUQL9U31VAeZe/bxr+Mf/pW1pABAb9rZGGN\nscP9jKUiJZPFfQCK3W3nu2XjRwKI6F7jlCwLGm+sDPhMURw3QI006s6pbeIJq1vo\nFlj94gMzsyIkuEf4tdKkWNtygbltD5g/1ZoO75vIDbf/E8P44G+JuLG6UV4gf40d\noNuQFuLgpOx8bWHy2Ev5Zcs4RhtMCQhQ1KUNZWBmR7zIvXbuJFUww68bznVL4SJY\nvbYTX/8TboeTYBN/Vp+d1NocTfO8h5ikdGxILyiKZiV/wguXd9nIR0KdI+8++sIT\nRnjuqmKYZwG0GMbwnCkdz2HkF/bYgd+JABEBAAHCwF8EGAEIABMFAmIyIM8JEMLX\nr0LgVphNAhsMAADDuggAX6EyWbfc1Ti2GCogyrUIp+2nh6IqVzG0CtqANBGUA9re\n60U+NrgXzffcZ+yrFYL6cT0C2XAutpP0o1wfUnsl19FMIPc6JOej7GOzew2flcuR\nRdxps7nqP00F2tce9hu+BugxW6K7bAnmxlq8K6n7/oZXsS1SJejl3pEFB0l4bIRL\ncp/Ql17hvtYLjb3qBNURS+Iu2GHsLZHJGpG50VQBk2kiVS0RjN17GiOejTs+Hb+4\nLEW3cv+Lk1RHAThlxX3XGQgU6M28ncS8Xs3WrqMk97nNYg8+xDX8YAqUZLa+kkYL\nApar4GBPVjEMVuNjtPfgC9PtIhFhnK3BFX7VZaCs3Q==\n=/EpH\n-----END PGP PUBLIC KEY BLOCK-----',
    pgpPublicKeyProof: '45a32da3eaaf89803af0cf6f13d68518147ca48c170f3d30a7fe38610513115e0bc73a9d6ea4e3d866014478e576baddfb705a0a36367fe11b8732c47f0b9c8f',
  },
  creationDate: new Date('2022-03-08T11:41:07.245Z'),

  symmetricKey: 'TODO',
  symmetricKeyEncrypted: 'TODO',
  symmetricKeySignature: 'TODO',

  currency: 'EUR',
  disputeActive: false,
  id: '14-15',
  kycRequired: false,
  kycConfirmed: false,
  paymentConfirmed: null,
  paymentMade: null,
  paymentMethod: 'iban',
  price: 89.04,
  premium: 1.5,
  escrow: 'bcrt1qxhkluxqp9u5f4a79vclgdah5vrzjzn2t8yn5rje3cnkvqk6u9fgqe5raag',
  releaseAddress: 'bcrt1qxhkluxqp9u5f4a79vclgdah5vrzjzn2t8yn5rje3cnkvqk6u9fgqe5raag',
  releaseTransaction: 'rawtransaction',
  canceled: false,
  ratingBuyer: 0,
  ratingSeller: 0,

  messages: 0,
}