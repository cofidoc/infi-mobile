import { useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import { getGeneratedActs } from "../utils";
import { CareFormValues } from "../FormCare";

export function ActsField({ name, index }: { name: string; index: number }) {
  const { values, setFieldValue } = useFormikContext<CareFormValues>();

  const acts = useMemo(() => getGeneratedActs(values.cares?.[index]), [values, index]);

  useEffect(() => {
    setFieldValue(name, acts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, setFieldValue, JSON.stringify(acts)]);
  return null;
}
