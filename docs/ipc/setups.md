# IPC: Setups Channel

Channels
- `setups:list` → `{ data: Setup[], error: null }`
- `setups:create` → `{ data: Setup, error: null }`
- `setups:get` → `{ data: Setup, error: null }`
- `setups:update` → `{ data: Setup, error: null }`
- `setups:delete` → `{ data: { success: true }, error: null }`

On failure, handlers return `{ data: null, error: { code, message } }`.

Error codes
- `E_INVALID_ID` — ID tidak valid (bukan angka)
- `E_NOT_FOUND` — data tidak ditemukan
- `E_VALIDATION` — payload tidak sesuai schema
- `E_INTERNAL` — kesalahan tak terduga

Schema (Zod)
```ts
type NumberLike = number | string

type SetupCreate = {
  client_candidate: string
  contract_value: NumberLike
  commission_price: NumberLike
  software_price: NumberLike
  employee1: string
  percent1: NumberLike
  employee2: string
  percent2: NumberLike
  net_value1: NumberLike
  net_value2: NumberLike
}

// Update: hanya field di atas yang boleh diubah (whitelist)
```

Notes
- Respons IPC dibungkus `{ data, error }`. Layer `src/services/setupsApi.js` sudah meng-unpack menjadi nilai `data` untuk konsumsi komponen React.

