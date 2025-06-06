export type FormStructure = {
  id?: string;
  title: string;
  description: string;
  fields: Field[];
};

export type Field =
  | {
      id: string;
      type: "text";
      label: string;
      isRequired: boolean;
    }
  | {
      id: string;
      type: "paragraph";
      label: string;
      isRequired: boolean;
    }
  | {
      id: string;
      type: "select";
      label: string;
      options: Array<{ id: string; label: string }>;
      isRequired: boolean;
    }
  | {
      id: string;
      type: "checkbox";
      label: string;
      options: Array<{ id: string; label: string }>;
      isRequired: boolean;
    };
