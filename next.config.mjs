/** @type {import('next').NextConfig} */
import withTM from "next-transpile-modules";
const withTranspile = withTM(["pdfkit", "fontkit"]);
const nextConfig = {
   turbopack: {},
   webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
};

export default withTranspile(nextConfig);
