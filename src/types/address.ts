export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
}

export interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}

export interface AddressData {
  province: Province | null;
  district: District | null;
  ward: Ward | null;
  specificAddress: string;
}

export interface AddressFormData {
  provinceCode: number | null;
  districtCode: number | null;
  wardCode: number | null;
  specificAddress: string;
}
