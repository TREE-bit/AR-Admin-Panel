// APP 管理共用的 10 个印度 UPI 应用。
// 会员 APP 信息、APP 数据收集、APP 银行、黑名单、登录失败都用这里的 bankCode。

export type AppUpiBank = {
  bankCode: string
  bankName: string
  /** UPI 句柄后缀，如 @ybl */
  upiSuffix: string
  packageName: string
  color: string
  short: string
}

export const APP_UPI_BANKS: AppUpiBank[] = [
  { bankCode: 'PHONEPE', bankName: 'PhonePe', upiSuffix: '@ybl', packageName: 'com.phonepe.app', color: '#5F259F', short: 'Pe' },
  { bankCode: 'PAYTM', bankName: 'Paytm', upiSuffix: '@paytm', packageName: 'net.one97.paytm', color: '#00BAF2', short: 'Pt' },
  { bankCode: 'FREECHARGE', bankName: 'Freecharge', upiSuffix: '@freecharge', packageName: 'com.freecharge.android', color: '#E4572E', short: 'Fc' },
  { bankCode: 'MONEYVIEW', bankName: 'Moneyview', upiSuffix: '@moneyview', packageName: 'com.whizdm.moneyview', color: '#1B7F4E', short: 'Mv' },
  { bankCode: 'GOOGLEPAY', bankName: 'Google Pay', upiSuffix: '@okaxis', packageName: 'com.google.android.apps.nbu.paisa.user', color: '#1A73E8', short: 'Gp' },
  { bankCode: 'BHIM', bankName: 'BHIM', upiSuffix: '@upi', packageName: 'in.org.npci.upiapp', color: '#F37920', short: 'Bh' },
  { bankCode: 'MOBIKWIK', bankName: 'MobiKwik', upiSuffix: '@ikwik', packageName: 'com.mobikwik_new', color: '#E31E24', short: 'Mk' },
  { bankCode: 'CRED', bankName: 'CRED', upiSuffix: '@axisb', packageName: 'com.dreamplug.androidapp', color: '#111111', short: 'Cr' },
  { bankCode: 'BHARATPE', bankName: 'BharatPe', upiSuffix: '@bharatpe', packageName: 'com.bharatpe.app', color: '#2F6BFF', short: 'Bp' },
  { bankCode: 'AMAZONPAY', bankName: 'Amazon Pay', upiSuffix: '@apl', packageName: 'in.amazon.mShop.android.shopping', color: '#FF9900', short: 'Ap' },
]

export function appUpiBankCodes() {
  return APP_UPI_BANKS.map((item) => item.bankCode)
}

export function findAppUpiBank(bankCode: string) {
  return APP_UPI_BANKS.find((item) => item.bankCode === bankCode)
}

export function appBankIcon(bank: AppUpiBank) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="${bank.color}"/><text x="32" y="40" text-anchor="middle" font-size="18" fill="#ffffff" font-family="sans-serif">${bank.short}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
