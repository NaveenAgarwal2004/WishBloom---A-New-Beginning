'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import useWishBloomStore from '@/store/useWishBloomStore'
import { VALIDATION_LIMITS } from '@/config/constants'
import { useSoundEffects } from '@/hooks/useSoundEffects'

//useFieldArray requires arrays of objects, not primitives
// Transform string[] to array of objects for react-hook-form compatibility
const step4Schema = z.object({
  celebrationWishPhrases: z
    .array(
      z.object({
        value: z.string()
          .min(1, 'Wish cannot be empty')
          .max(VALIDATION_LIMITS.CELEBRATION_PHRASE_MAX_LENGTH)
      })
    )
    .min(VALIDATION_LIMITS.CELEBRATION_PHRASES_MIN)
    .max(VALIDATION_LIMITS.CELEBRATION_PHRASES_MAX),
})

type Step4FormData = z.infer<typeof step4Schema>

export default function Step4Wishes() {
  const store = useWishBloomStore()
  const { play } = useSoundEffects()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    mode: 'onBlur',
    defaultValues: {
      // Transform string[] from store to object array format
      celebrationWishPhrases: store.celebrationWishPhrases.map(phrase => ({ value: phrase })),
    },
  })

  // ✅ ROOT FIX: Now properly typed - useFieldArray works with object arrays
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'celebrationWishPhrases',
  })

  const onSubmit = (data: Step4FormData) => {
    // Transform back to string[] for store
    const phrasesAsStrings = data.celebrationWishPhrases.map(item => item.value)
    store.setCelebrationWishPhrases(phrasesAsStrings)
    
    // 🔊 Play step completion sound
    play('step-complete')
    
    store.nextStep()
  }

  const handleAddWish = () => {
    if (fields.length < VALIDATION_LIMITS.CELEBRATION_PHRASES_MAX) {
      append({ value: '' })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">
        Celebration Wishes
      </h2>
      <p className="text-body text-warmCream-700 mb-8">
        These phrases will float across the screen during the celebration
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 mb-8">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  {...register(`celebrationWishPhrases.${index}.value` as const)}
                  type="text"
                  maxLength={VALIDATION_LIMITS.CELEBRATION_PHRASE_MAX_LENGTH}
                  className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="Add a wish..."
                />
                {errors.celebrationWishPhrases?.[index]?.value && (
                  <p className="text-caption text-fadedRose mt-1">
                    {errors.celebrationWishPhrases[index]?.value?.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-3 bg-fadedRose/20 text-fadedRose rounded-lg hover:bg-fadedRose/30 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {errors.celebrationWishPhrases?.root && (
            <p className="text-caption text-fadedRose">
              {errors.celebrationWishPhrases.root.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddWish}
          disabled={fields.length >= VALIDATION_LIMITS.CELEBRATION_PHRASES_MAX}
          className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          <Plus size={20} /> Add Wish
        </button>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => store.previousStep()}
            className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            type="submit"
            className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold hover:shadow-colored-gold transition-all flex items-center gap-2"
          >
            Next <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}