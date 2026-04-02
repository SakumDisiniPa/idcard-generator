declare namespace NodeJS {
  interface ProcessEnv {
    BLOB_READ_WRITE_TOKEN: string;
    SECRET_ACCESS_ID: string;
    NEXT_PUBLIC_SECRET_ACCESS_ID: string;
  }
}

declare module 'qrcode' {
  namespace QRCode {
    interface QRCodeToDataURLOptions {
      color?: {
        dark?: string;
        light?: string;
      };
      width?: number;
      margin?: number;
    }
  }
  
  function toDataURL(
    text: string,
    options?: QRCode.QRCodeToDataURLOptions,
    callback?: (error: Error | null, url?: string) => void
  ): void;
}
