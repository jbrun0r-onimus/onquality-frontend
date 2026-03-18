import {
  MaybeRef,
  MaybeRefOrGetter,
  UnwrapNestedRefs,
  reactive,
  unref,
  watch,
} from 'vue';
import { FormOptions, Path, useForm } from 'vee-validate';
import { InferType, Schema } from 'yup';
import { useI18n } from 'vue-i18n';
import { SchemaIn, TypeSchema } from 'src/typings/schema.typings';

/**
 * Improvements over the default vee-validate's `useForm` composable:
 * - Auto type inference from the schema
 * - Form resets when locale changes
 * - Cast types using schema
 */
export function useAppForm<
  TSchema extends Schema = Schema,
  TValues extends SchemaIn<TSchema> = SchemaIn<TSchema>,
  TOutput extends InferType<TSchema> = InferType<TSchema>
>(
  schema: MaybeRef<TSchema>,
  opts?: Omit<FormOptions<TValues, TOutput>, 'validationSchema'>
) {
  const { locale } = useI18n();

  const context = useForm({
    ...opts,
    validationSchema: schema as TypeSchema<TSchema>,
  });

  const defineAppComponentBinds = <TPath extends Path<TValues>>(
    path: MaybeRefOrGetter<TPath>
  ) =>
    context.defineComponentBinds(path, (state) => ({
      props: {
        modelValue: state.value,
        error: state.touched && !!state.errors.length,
        'error-message': state.errors[0],
      },
    }));

  const defineAllAppComponentBinds = () => {
    const unrefSchema = unref(schema);

    if (!('fields' in unrefSchema)) throw new Error('Invalid schema');

    const binds: Record<string, unknown> = {};

    const paths = Object.keys(unrefSchema.fields as Record<string, unknown>);

    for (const path of paths) {
      binds[path] = defineAppComponentBinds(path as Path<TValues>);
    }

    return reactive(binds) as UnwrapNestedRefs<{
      [TPath in Path<TValues>]: ReturnType<
        typeof defineAppComponentBinds<TPath>
      >;
    }>;
  };

  watch(locale, () => context.resetForm());

  const handleSubmit = (cb: (values: TOutput) => unknown) =>
    context.handleSubmit((data) => cb(unref(schema).cast(data)));

  return {
    ...context,
    handleSubmit,
    defineAppComponentBinds,
    defineAllAppComponentBinds,
  };
}
