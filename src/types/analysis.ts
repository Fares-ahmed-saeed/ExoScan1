export type DataPoint = {
  time: number;
  flux: number;
};

export type AnalysisResult = {
  // Primary detection results
  planetDetected: boolean;
  confidence: number;
  
  // Transit parameters
  transitDepth: string;
  period: string;
  duration: string;
  
  // Statistical metrics
  signalToNoise: number;
  chi2: number;
  falseAlarmProbability: number;
  
  // Data quality metrics
  dataPoints: number;
  observationTime: string;
  rmsNoise: number;
  
  // Additional parameters
  semiMajorAxis?: string;
  planetRadius?: string;
  equilibriumTemp?: string;
  
  // Analysis details
  bestPeriods: Array<{
    period: number;
    power: number;
    depth: number;
    snr: number;
  }>;
  
  // Quality flags
  qualityFlags: string[];
  
  // Raw data for visualization
  lightCurveData?: DataPoint[];
  detrendedData?: DataPoint[];
};

export type AnalysisStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export type ProcessingStep = 
  | 'parsing'
  | 'validation' 
  | 'preprocessing'
  | 'periodogram'
  | 'transit_search'
  | 'validation_checks'
  | 'statistics';