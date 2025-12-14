'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import useWishBloomStore from '@/store/useWishBloomStore'
import { MessageSchema } from '@/schemas/wishbloom.schema'
import { VALIDATION_LIMITS, MESSAGE_TYPES } from '@/config/constants'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { IMessage } from '@/models/WishBloom'
import type { z } from 'zod'

type MessageFormData = z.infer<typeof MessageSchema>

export default function Step3Messages() {
  const store = useWishBloomStore()
  const { play } = useSoundEffects()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MessageFormData>({
    resolver: zodResolver(MessageSchema),
    mode: 'onBlur',
    defaultValues: {
      type: 'letter',
      greeting: '',
      content: '',
      closing: '',
      signature: '', // ✅ Set default
      title: '',
      postscript: '',
      contributor: { 
        id: undefined,
        name: '', 
        email: '',
        contributionCount: 1
      },
      date: new Date().toISOString().split('T')[0], // ✅ Set default date
    },
  })

  const messageType = watch('type')
  const canProceed = store.messages.length >= VALIDATION_LIMITS.MESSAGES_MIN_REQUIRED

  const handleNext = () => {
    // 🔊 Play step completion sound
    play('step-complete')
    store.nextStep()
  }

  const onSubmit = (data: MessageFormData) => {
    // ✅ Ensure all required fields are set
    const message: IMessage = {
      ...data,
      id: nanoid(8),
      signature: data.signature || 'Anonymous', // Fallback
      date: data.date || new Date().toISOString().split('T')[0], // Fallback
      contributor: {
        id: data.contributor.id || nanoid(8),
        name: data.contributor.name || 'Anonymous',
        email: data.contributor.email || undefined,
        contributionCount: data.contributor.contributionCount || 1,
      },
      createdAt: new Date(),
    }

    store.addMessage(message)
    reset()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Add Messages</h2>
      <p className="text-body text-warmCream-700 mb-8">Write at least 1 heartfelt message</p>

      {/* Message Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-warmCream-50 rounded-xl p-8 border-2 border-warmCream-300 mb-8">
        <div className="space-y-6">
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
              Message Type
            </label>
            <div className="flex gap-4">
              {MESSAGE_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('type')}
                    type="radio"
                    value={type}
                    className="w-5 h-5"
                  />
                  <span className="text-body font-body capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {messageType === 'letter' && (
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Greeting
              </label>
              <input
                {...register('greeting')}
                type="text"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="Dear Emma,"
              />
            </div>
          )}

          {messageType === 'poem' && (
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Poem Title (optional)
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="For Emma on Her 25th"
              />
            </div>
          )}

          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
              {messageType === 'letter' ? 'Message *' : 'Poem *'}
            </label>
            <textarea
              {...register('content')}
              maxLength={VALIDATION_LIMITS.MESSAGE_CONTENT_MAX}
              rows={10}
              className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none resize-none"
              placeholder={messageType === 'letter' ? 'Write your heartfelt message...' : 'Write your poem (use line breaks)...'}
            />
            {errors.content && (
              <p className="text-caption text-fadedRose mt-1">{errors.content.message}</p>
            )}
          </div>

          {messageType === 'letter' && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                    Closing
                  </label>
                  <input
                    {...register('closing')}
                    type="text"
                    className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                    placeholder="With love,"
                  />
                </div>
                <div>
                  <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                    Signature *
                  </label>
                  <input
                    {...register('signature')}
                    type="text"
                    className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                    placeholder="Sarah"
                  />
                  {errors.signature && (
                    <p className="text-caption text-fadedRose mt-1">{errors.signature.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                  Postscript (optional)
                </label>
                <input
                  {...register('postscript')}
                  type="text"
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="P.S. - Can't wait to celebrate with you!"
                />
              </div>
            </>
          )}

          {messageType === 'poem' && (
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Signature *
              </label>
              <input
                {...register('signature')}
                type="text"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="Sarah"
              />
              {errors.signature && (
                <p className="text-caption text-fadedRose mt-1">{errors.signature.message}</p>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Contributor Name *
              </label>
              <input
                {...register('contributor.name')}
                type="text"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="Your name"
              />
              {errors.contributor?.name && (
                <p className="text-caption text-fadedRose mt-1">{errors.contributor.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Contributor Email (optional)
              </label>
              <input
                {...register('contributor.email')}
                type="email"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Add Message
          </button>
        </div>
      </form>

      {/* Messages List */}
      {store.messages.length > 0 && (
        <div className="mb-8">
          <h3 className="text-h5 font-heading font-semibold text-sepiaInk mb-4">
            Added Messages ({store.messages.length})
          </h3>
          <div className="space-y-4">
            {store.messages.map((message) => (
              <div key={message.id} className="bg-warmCream-50 rounded-lg p-6 border-2 border-warmCream-300">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-h6 font-heading font-semibold text-sepiaInk">
                    {message.type === 'letter' ? 'Letter' : message.title || 'Poem'}
                  </h4>
                  <button
                    onClick={() => store.deleteMessage(message.id)}
                    type="button"
                    className="px-3 py-1 bg-fadedRose/20 text-fadedRose rounded font-body text-caption font-semibold hover:bg-fadedRose/30 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                <p className="text-body-sm text-warmCream-700 line-clamp-3 mb-2">{message.content}</p>
                <p className="text-caption text-fadedGold font-accent italic">— {message.signature}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!canProceed && (
        <p className="text-body text-fadedRose mb-4">Please add at least 1 message to continue</p>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => store.previousStep()}
          type="button"
          className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          type="button"
          className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-gold transition-all flex items-center gap-2"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}