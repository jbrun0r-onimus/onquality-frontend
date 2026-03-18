import { watch, Ref, ref, MaybeRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AnyObject, Maybe, ObjectSchema, InferType } from 'yup';
import { trimObject } from 'src/helpers/misc.helpers';

export function useUrlQueryRef<
  TIn extends Maybe<AnyObject>,
  TSchema extends ObjectSchema<TIn>
>(schema: TSchema, enabled: MaybeRef<boolean> = true): Ref<InferType<TSchema>> {
  const router = useRouter();
  const route = useRoute();

  const valueRef = ref(schema.getDefault());
  let pushing = false;

  watch(
    () => route.query,
    (query) => {
      if (!enabled || pushing) return;
      try {
        valueRef.value = schema.validateSync(
          {
            ...valueRef.value,
            ...query,
          },
          {
            stripUnknown: true,
          }
        );
      } catch {
        valueRef.value = schema.getDefault();
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    valueRef,
    (value) => {
      if (!enabled) return;
      pushing = true;
      router
        .push({
          query: {
            ...route.query,
            ...trimObject(value),
          },
          replace: true,
        })
        .finally(() => {
          pushing = false;
        });
    },
    { immediate: true }
  );

  return valueRef;
}
