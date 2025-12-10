'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useWishBloomStore from '@/store/useWishBloomStore'
import { VALIDATION_LIMITS } from '@/config/constants'

// Type for session user with id
interface SessionUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

// ✅ Zod schema for Step 1
const step1Schema = z.object({
  recipientName: z
    .string()
    .min(VALIDATION_LIMITS.RECIPIENT_NAME_MIN, 'Recipient name is required')
    .max(VALIDATION_LIMITS.RECIPIENT_NAME_MAX),
  age: z
    .number()
    .int()
    .min(VALIDATION_LIMITS.AGE_MIN)
    .max(VALIDATION_LIMITS.AGE_MAX)
    .nullable()
    .optional(),
  creativeAgeDescription: z
    .string()
    .max(VALIDATION_LIMITS.CREATIVE_AGE_MAX)
    .optional(),
  introMessage: z
    .string()
    .min(VALIDATION_LIMITS.INTRO_MESSAGE_MIN, `Intro message must be at least ${VALIDATION_LIMITS.INTRO_MESSAGE_MIN} characters`)
    .max(VALIDATION_LIMITS.INTRO_MESSAGE_MAX),
  createdByName: z.string().optional(),
  createdByEmail: z.string().email('Invalid email').or(z.literal('')).optional(),
})

type Step1FormData = z.infer<typeof step1Schema>

export default function Step1Info() {
  const store = useWishBloomStore()
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur', // ✅ Validate on blur for better UX
    defaultValues: {
      recipientName: store.recipientName || '',
      age: store.age,
      creativeAgeDescription: store.creativeAgeDescription || '',
      introMessage: store.introMessage || '',
      createdByName: store.createdBy.name || '',
      createdByEmail: store.createdBy.email || '',
    },
  })

  // ✅ Auto-populate creator info from session if logged in
  useEffect(() => {
    if (session?.user && !store.createdBy.id) {
      // Only auto-fill if not already set
      if (session.user.name && !store.createdBy.name) {
        setValue('createdByName', session.user.name)
      }
      if (session.user.email && !store.createdBy.email) {
        setValue('createdByEmail', session.user.email)
      }
    }
  }, [session, store.createdBy, setValue])

  const onSubmit = (data: Step1FormData) => {
    // ✅ Update store
    store.setRecipientName(data.recipientName)
    store.setAge(data.age ?? null)
    store.setCreativeAgeDescription(data.creativeAgeDescription || '')
    store.setIntroMessage(data.introMessage)
    
    // ✅ Set createdBy with session user ID if logged in
    const sessionUser = session?.user as SessionUser | undefined
    store.setCreatedBy({
      id: sessionUser?.id || undefined,
      name: data.createdByName || sessionUser?.name || '',
      email: data.createdByEmail || sessionUser?.email || '',
    })

    // Navigate to next step
    store.nextStep()
  }

  // Watch character counts
  const recipientName = watch('recipientName')
  const introMessage = watch('introMessage')

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-8">Recipient Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Name */}
        <div>
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
            Recipient Name *
          </label>
          <input
            {...register('recipientName')}
            type="text"
            maxLength={VALIDATION_LIMITS.RECIPIENT_NAME_MAX}
            className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
            placeholder="Emma"
            data-testid="recipient-name-input"
          />
          {errors.recipientName && (
            <p className="text-caption text-fadedRose mt-1">{errors.recipientName.message}</p>
          )}
          <p className="text-caption text-warmCream-600 text-right mt-1">
            {recipientName?.length || 0}/{VALIDATION_LIMITS.RECIPIENT_NAME_MAX}
          </p>
        </div>

        {/* Age (optional) */}
        <div>
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
            Age (optional)
          </label>
          <input
            {...register('age', { valueAsNumber: true })}
            type="number"
            min={VALIDATION_LIMITS.AGE_MIN}
            max={VALIDATION_LIMITS.AGE_MAX}
            className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
            placeholder="25"
          />
          {errors.age && (
            <p className="text-caption text-fadedRose mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* Creative Age Description */}
        <div>
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
            Creative Age Description (optional)
          </label>
          <input
            {...register('creativeAgeDescription')}
            type="text"
            maxLength={VALIDATION_LIMITS.CREATIVE_AGE_MAX}
            className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
            placeholder="Twenty-Five Rotations Around the Sun"
          />
        </div>

        {/* Intro Message */}
        <div>
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
            Intro Message *
          </label>
          <textarea
            {...register('introMessage')}
            maxLength={VALIDATION_LIMITS.INTRO_MESSAGE_MAX}
            rows={8}
            className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none resize-none"
            placeholder="Dear Emma, on this special day..."
            data-testid="intro-message-textarea"
          />
          {errors.introMessage && (
            <p className="text-caption text-fadedRose mt-1">{errors.introMessage.message}</p>
          )}
          <p className="text-caption text-warmCream-600 text-right mt-1">
            {introMessage?.length || 0}/{VALIDATION_LIMITS.INTRO_MESSAGE_MAX}
          </p>
        </div>

        {/* Your Name (optional) */}
        <div>
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
            Your Name
          </label>
          <input
            {...register('createdByName')}
            type="text"
            className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
            placeholder="Sarah"
          />
        </div>

        {/* Your Email (optional) */}
        <div>
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
            Your Email (optional)
          </label>
          <input
            {...register('createdByEmail')}
            type="email"
            className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
            placeholder="sarah@example.com"
          />
          {errors.createdByEmail && (
            <p className="text-caption text-fadedRose mt-1">{errors.createdByEmail.message}</p>
          )}
        </div>

        {/* Next Button */}
        <button
          type="submit"
          disabled={!isValid}
          className="mt-8 px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-gold transition-all flex items-center gap-2 ml-auto"
          data-testid="step1-next-button"
        >
          Next <ArrowRight size={20} />
        </button>
      </form>
    </div>
  )
}
