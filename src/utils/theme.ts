/* breakpoints in pixels */
const bp: any = {
  xss: 0,
  xs: 320,
  sm: 480,
  md: 768,
  md1: 912,
  md2: 1024,
  lg: 1280,
  lg1: 1440,
  xl: 1920,
};

const px: typeof bp = {};
Object.keys(bp).forEach((key) => {
  px[key] = `${bp[key]}px`;
});

const theme = {
  bp: {
    nums: bp,
    px,
  },
};

export default theme;
