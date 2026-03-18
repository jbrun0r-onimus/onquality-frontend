import {
  BaseComponentBinds,
  FormContext,
  GenericObject,
  Path,
  PathValue,
} from 'vee-validate';
import { MaybeRefOrGetter, Ref } from 'vue';

export type LocalizedFormContext<
  TValues extends GenericObject = GenericObject,
  TOutput = TValues
> = FormContext<TValues, TOutput> & {
  defineLocalizedComponentBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject
  >(
    path: MaybeRefOrGetter<TPath>
  ): Ref<BaseComponentBinds<TValue> & TExtras>;
};
