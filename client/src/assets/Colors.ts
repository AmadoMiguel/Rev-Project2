const colors = {
    // Colors that are used
    darkGreen: '#388E3C',
    green: '#4CAF50',
    lightGreen: '#63b175',
    lighterGreen: '#c2e0c6',
    offWhite: '#FFFFFF',
    teal: '#009688',
    lightTeal: '#4ba876',
    orange: '#FF9800',
    red: '#F44336',
    unusedGrey: '#d7d7d7'
}

export const colorTypes = {
    // Specific colors for specific items.
    // Will be used randomly, so no need for super
    // organized styling sheets or anything.
    primary: colors.lightGreen,
    secondary: colors.teal,
    divider: colors.teal,
    important: colors.red,
    // donut: ['#3b00ed', '#9c27b0', '#ff9800', colors.darkGreen, '#d81b60', '#eb3693'],
    donut: [colors.orange, colors.lightGreen, colors.darkGreen, colors.teal, 'grey'],
    paper: "rgba(255, 255, 255, 0.85)"
}

export default colors;
