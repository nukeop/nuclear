export declare enum SettingType {
    BOOLEAN = "boolean",
    LIST = "list",
    NODE = "node",
    NUMBER = "number",
    STRING = "string",
    DIRECTORY = "directory"
}
export declare const settingsConfig: ({
    name: string;
    category: string;
    type: SettingType;
    prettyName: string;
    default: boolean;
    description?: undefined;
    min?: undefined;
    max?: undefined;
    unit?: undefined;
    placeholder?: undefined;
    options?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    description: string;
    type: SettingType;
    prettyName: string;
    default: boolean;
    min?: undefined;
    max?: undefined;
    unit?: undefined;
    placeholder?: undefined;
    options?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    type: SettingType;
    prettyName: string;
    default: number;
    description?: undefined;
    min?: undefined;
    max?: undefined;
    unit?: undefined;
    placeholder?: undefined;
    options?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    description: string;
    type: SettingType;
    prettyName: string;
    default: number;
    min: number;
    max: number;
    unit: string;
    placeholder?: undefined;
    options?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    type: SettingType;
    prettyName: string;
    default: number;
    min: number;
    max: number;
    description?: undefined;
    unit?: undefined;
    placeholder?: undefined;
    options?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    type: SettingType;
    prettyName: string;
    default?: undefined;
    description?: undefined;
    min?: undefined;
    max?: undefined;
    unit?: undefined;
    placeholder?: undefined;
    options?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    type: SettingType;
    prettyName: string;
    placeholder: string;
    options: {
        key: string;
        text: string;
        value: string;
    }[];
    default: any;
    description?: undefined;
    min?: undefined;
    max?: undefined;
    unit?: undefined;
    buttonText?: undefined;
    buttonIcon?: undefined;
} | {
    name: string;
    category: string;
    type: SettingType;
    prettyName: string;
    buttonText: string;
    buttonIcon: string;
    default?: undefined;
    description?: undefined;
    min?: undefined;
    max?: undefined;
    unit?: undefined;
    placeholder?: undefined;
    options?: undefined;
})[];
