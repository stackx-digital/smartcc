export interface CardSummary {
  name: string; slug: string; url: string; description: string
  min_income_monthly: number; annual_fee_str: string; is_free_annual: boolean
  cashback: string; cashback_pct: number; interest_rate: string; interest_free_days: number
  is_travel: boolean; is_petrol: boolean; is_dining: boolean; is_grocery: boolean
  is_islamic: boolean; is_shopping: boolean; is_grab: boolean; has_cashback: boolean
  image: string | null
}

export interface DetailTable { caption: string; headers: string[]; rows: string[][] }
export interface DetailTile { id: string; title: string; text: string[]; tables: DetailTable[] }
export interface DetailEntry { label: string; items: { value: string; notes: string[] }[] }
export interface DetailFeatureGroup { group: string; items: { name: string; desc: string }[] }

export interface CardDetail {
  highlight: string
  review: string[]
  benefits: DetailTile[]
  features: DetailFeatureGroup[]
  fees: DetailEntry[]
  requirements: DetailEntry[]
}
