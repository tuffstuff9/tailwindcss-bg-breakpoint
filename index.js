module.exports = function ({ addUtilities, theme }) {
  const breakpoints = theme('screens');
  const userColors = theme('backgroundColorsByBreakpoint', {});
  const allColors = theme('colors');

  // Function to resolve Tailwind color classes to actual color codes
  // Without this, only rgb values would have to be used instead of
  // tailwind colors like 'red-500' or 'gray-100', etc
  const resolveColor = (colorName) => {
    const [color, shade] = colorName.split('-');
    return allColors[color] && allColors[color][shade]
      ? allColors[color][shade]
      : colorName;
  };

  const defaultColors = {
    DEFAULT: 'black',
    sm: '#a3e635',
    md: '#f59e0b',
    lg: '#ea580c',
    xl: '#991b1b',
    '2xl': '#881337',
  };

  // Merge user-defined colors with defaults, in order to override
  // default colors with user-defined colors.
  const finalColors = { ...defaultColors, ...userColors };

  let newUtilities = {
    '.bg-breakpoint': {
      backgroundColor: finalColors.DEFAULT,
    },
  };

  Object.entries(breakpoints).forEach(([breakpoint]) => {
    if (finalColors[breakpoint]) {
      const colorCode = resolveColor(finalColors[breakpoint]);
      if (!newUtilities[`@screen ${breakpoint}`]) {
        newUtilities[`@screen ${breakpoint}`] = {};
      }
      newUtilities[`@screen ${breakpoint}`]['.bg-breakpoint'] = {
        backgroundColor: colorCode,
      };
    }
  });

  addUtilities(newUtilities, ['responsive']);
};
