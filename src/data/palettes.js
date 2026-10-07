export const paletteOptions = [
    {
        id: "paper-clay",
        name: "Paper & clay",
        background: "#f3f0e7",
        paper: "#fbf9f3",
        ink: "#212c2a",
        muted: "#66726c",
        border: "#d8d7cb",
        accent: "#c35f43",
        accentDark: "#95432f",
        accentSoft: "#f2ded4",
        sage: "#456b5c",
    },
    {
        id: "sea-glass",
        name: "Sea glass",
        background: "#edf2ed",
        paper: "#f9fbf7",
        ink: "#24332e",
        muted: "#65746b",
        border: "#d2ddd3",
        accent: "#3d7465",
        accentDark: "#285447",
        accentSoft: "#d9e9df",
        sage: "#70927c",
    },
    {
        id: "sun-baked",
        name: "Sun baked",
        background: "#f5eddd",
        paper: "#fcf8ee",
        ink: "#382c24",
        muted: "#7e6b5b",
        border: "#e0d2be",
        accent: "#ae4f34",
        accentDark: "#823b29",
        accentSoft: "#f2ddc9",
        sage: "#667c58",
    },
];

export const getPaletteById = (id) =>
    paletteOptions.find((palette) => palette.id === id) ?? paletteOptions[0];
