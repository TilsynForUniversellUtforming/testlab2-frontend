export interface TestInputParameters {
  url: string;
}

export interface CreateMaalingParameters {
  urls: string[];
}

export type MaalingResponse = {
  id: number;
  url: string;
};
