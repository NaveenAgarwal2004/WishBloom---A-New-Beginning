'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import useWishBloomStore from '@/store/useWishBloomStore'
import ImageUploader from '@/components/ImageUploader'
import Hero from '@/components/Hero'
import IntroMessage from '@/components/IntroMessage'
import MemoryGallery from '@/components/MemoryGallery'
import MessagesSection from '@/components/MessagesSection'
import CelebrationSection from '@/components/CelebrationSection'
import Footer from '@/components/Footer'
import { ArrowRight, ArrowLeft, Plus, Trash2, Edit2, Check, Loader2 } from 'lucide-react'

/**
 * Multi-step Creator Flow
 */
export default function CreatePage() {
  const router = useRouter()
  const store = useWishBloomStore()
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [publishedUrl, setPublishedUrl] = useState(null)

  // Step 1: Recipient Info (use local state with debounced sync to store to avoid typing issues)
  const Step1 = () => {
    // Local copies to avoid updating global store on every keystroke
    const [recipientNameLocal, setRecipientNameLocal] = useState(store.recipientName || '')
    const [ageLocal, setAgeLocal] = useState(store.age ?? '')
    const [creativeLocal, setCreativeLocal] = useState(store.creativeAgeDescription || '')
    const [introLocal, setIntroLocal] = useState(store.introMessage || '')
    const [createdByLocal, setCreatedByLocal] = useState({ ...(store.createdBy || { id: '', name: '', email: '' }) })

    // Initialize local state from the store on mount only (avoid syncing on every store update to prevent input overwrite)
    useEffect(() => {
      setRecipientNameLocal(store.recipientName || '')
      setAgeLocal(store.age ?? '')
      setCreativeLocal(store.creativeAgeDescription || '')
      setIntroLocal(store.introMessage || '')
      setCreatedByLocal({ ...(store.createdBy || { id: '', name: '', email: '' }) })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Sync to store on blur (or when user explicitly leaves the field) to avoid race conditions
    const syncRecipientName = () => store.setRecipientName(recipientNameLocal)
    const syncAge = () => store.setAge(ageLocal === '' ? null : parseInt(ageLocal))
    const syncCreative = () => store.setCreativeAgeDescription(creativeLocal)
    const syncIntro = () => store.setIntroMessage(introLocal)
    const syncCreatedBy = () => store.setCreatedBy({ ...createdByLocal, id: createdByLocal.id || undefined })

    // Sync all data to store
    const syncAllData = () => {
      syncRecipientName()
      syncAge()
      syncCreative()
      syncIntro()
      syncCreatedBy()
    }

    const canProceed = recipientNameLocal.trim() && introLocal.trim() && createdByLocal.name.trim()

    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-8">Recipient Information</h2>

        <div className="space-y-6">
          {/* Recipient Name */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Recipient Name *</label>
            <input
              type="text"
              value={recipientNameLocal}
              onChange={(e) => setRecipientNameLocal(e.target.value)}
              onBlur={syncRecipientName}
              maxLength={50}
              className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
              placeholder="Emma"
            />
            <p className="text-caption text-warmCream-600 text-right mt-1">{recipientNameLocal.length}/50</p>
          </div>

          {/* Age (optional) */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Age (optional)</label>
            <input
              type="number"
              value={ageLocal}
              onChange={(e) => setAgeLocal(e.target.value)}
              onBlur={syncAge}
              min="1"
              max="120"
              className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
              placeholder="25"
            />
          </div>

          {/* Creative Age Description */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Creative Age Description (optional)</label>
            <input
              type="text"
              value={creativeLocal}
              onChange={(e) => setCreativeLocal(e.target.value)}
              onBlur={syncCreative}
              maxLength={100}
              className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
              placeholder="Twenty-Five Rotations Around the Sun"
            />
          </div>

          {/* Intro Message */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Intro Message *</label>
            <textarea
              value={introLocal}
              onChange={(e) => setIntroLocal(e.target.value)}
              onBlur={syncIntro}
              maxLength={1000}
              rows={8}
              className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none resize-none"
              placeholder="Dear Emma, on this special day..."
            />
            <p className="text-caption text-warmCream-600 text-right mt-1">{introLocal.length}/1000</p>
          </div>

          {/* Your Name */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Your Name *</label>
            <input
              type="text"
              value={createdByLocal.name}
              onChange={(e) => setCreatedByLocal({ ...createdByLocal, name: e.target.value })}
              onBlur={syncCreatedBy}
              className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
              placeholder="Sarah"
            />
          </div>

          {/* Your Email (optional) */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Your Email (optional)</label>
            <input
              type="email"
              value={createdByLocal.email}
              onChange={(e) => setCreatedByLocal({ ...createdByLocal, email: e.target.value })}
              onBlur={syncCreatedBy}
              className="w-full bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body transition-colors outline-none"
              placeholder="sarah@example.com"
            />
          </div>
        </div>

        <button
          onClick={() => {
            syncAllData()
            store.nextStep()
          }}
          disabled={!canProceed}
          className="mt-8 px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-gold transition-all flex items-center gap-2 ml-auto"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    )
  }

  // Step 2: Memories
  const Step2 = () => {
    const [editingMemory, setEditingMemory] = useState(null)
    const [memoryForm, setMemoryForm] = useState({
      title: '',
      description: '',
      date: '',
      imageUrl: '',
      type: 'standard',
      tags: [],
      contributor: { name: '', email: '' },
    })

    const availableTags = ['love', 'milestone', 'nostalgic', 'celebration', 'funny']

    const handleAddMemory = () => {
      if (!memoryForm.title || !memoryForm.description || !memoryForm.date || !memoryForm.contributor.name) {
        alert('Please fill in all required fields')
        return
      }

      const memory = {
        ...memoryForm,
        id: nanoid(8),
        contributor: {
          ...memoryForm.contributor,
          id: nanoid(8),
        },
        rotation: 0,
        createdAt: new Date().toISOString(),
      }

      if (editingMemory) {
        store.updateMemory(editingMemory, memory)
        setEditingMemory(null)
      } else {
        store.addMemory(memory)
      }

      // Reset form
      setMemoryForm({
        title: '',
        description: '',
        date: '',
        imageUrl: '',
        type: 'standard',
        tags: [],
        contributor: { name: '', email: '' },
      })
    }

    const handleEdit = (memory) => {
      setEditingMemory(memory.id)
      setMemoryForm(memory)
    }

    const canProceed = store.memories.length >= 3

    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Add Memories</h2>
        <p className="text-body text-warmCream-700 mb-8">Share at least 3 memorable moments</p>

        {/* Memory Form */}
        <div className="bg-warmCream-50 rounded-xl p-8 border-2 border-warmCream-300 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Title *</label>
                <input
                  type="text"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="The Coffee Shop Revelation"
                />
              </div>
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Date *</label>
                <input
                  type="date"
                  value={memoryForm.date}
                  onChange={(e) => setMemoryForm({ ...memoryForm, date: e.target.value })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Description *</label>
              <textarea
                value={memoryForm.description}
                onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                maxLength={1000}
                rows={6}
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none resize-none"
                placeholder="Tell the story behind this memory..."
              />
            </div>

            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Image (optional)</label>
              <ImageUploader
                onUpload={(url) => setMemoryForm({ ...memoryForm, imageUrl: url })}
                existingImage={memoryForm.imageUrl}
              />
            </div>

            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Memory Type</label>
              <div className="flex gap-4">
                {['standard', 'featured', 'quote'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="memoryType"
                      value={type}
                      checked={memoryForm.type === type}
                      onChange={(e) => setMemoryForm({ ...memoryForm, type: e.target.value })}
                      className="w-5 h-5"
                    />
                    <span className="text-body font-body capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-3">
                {availableTags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={memoryForm.tags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMemoryForm({ ...memoryForm, tags: [...memoryForm.tags, tag] })
                        } else {
                          setMemoryForm({ ...memoryForm, tags: memoryForm.tags.filter(t => t !== tag) })
                        }
                      }}
                      className="w-5 h-5"
                    />
                    <span className="text-body font-body capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Contributor Name *</label>
                <input
                  type="text"
                  value={memoryForm.contributor.name}
                  onChange={(e) => setMemoryForm({ ...memoryForm, contributor: { ...memoryForm.contributor, name: e.target.value } })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Contributor Email (optional)</label>
                <input
                  type="email"
                  value={memoryForm.contributor.email}
                  onChange={(e) => setMemoryForm({ ...memoryForm, contributor: { ...memoryForm.contributor, email: e.target.value } })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <button
              onClick={handleAddMemory}
              className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center gap-2"
            >
              {editingMemory ? <Check size={20} /> : <Plus size={20} />}
              {editingMemory ? 'Update Memory' : 'Add Memory'}
            </button>
          </div>
        </div>

        {/* Memories List */}
        {store.memories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-h5 font-heading font-semibold text-sepiaInk mb-4">
              Added Memories ({store.memories.length})
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {store.memories.map((memory) => (
                <div key={memory.id} className="bg-warmCream-50 rounded-lg p-6 border-2 border-warmCream-300">
                  {memory.imageUrl && (
                    <img src={memory.imageUrl} alt={memory.title} className="w-full h-32 object-cover rounded mb-4" />
                  )}
                  <h4 className="text-h6 font-heading font-semibold text-sepiaInk mb-2">{memory.title}</h4>
                  <p className="text-body-sm text-warmCream-700 line-clamp-2 mb-3">{memory.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="px-3 py-1 bg-fadedGold/20 text-fadedGold rounded font-body text-caption font-semibold hover:bg-fadedGold/30 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => store.deleteMemory(memory.id)}
                      className="px-3 py-1 bg-fadedRose/20 text-fadedRose rounded font-body text-caption font-semibold hover:bg-fadedRose/30 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!canProceed && (
          <p className="text-body text-fadedRose mb-4">Please add at least 3 memories to continue</p>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => store.previousStep()}
            className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={() => store.nextStep()}
            disabled={!canProceed}
            className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-gold transition-all flex items-center gap-2"
          >
            Next <ArrowRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  // Step 3: Messages (simplified for brevity - similar to Step 2)
  const Step3 = () => {
    const [messageForm, setMessageForm] = useState({
      type: 'letter',
      greeting: '',
      content: '',
      closing: '',
      signature: '',
      title: '',
      postscript: '',
      contributor: { name: '', email: '' },
    })

    const handleAddMessage = () => {
      if (!messageForm.content || !messageForm.signature || !messageForm.contributor.name) {
        alert('Please fill in all required fields')
        return
      }

      const message = {
        ...messageForm,
        id: nanoid(8),
        contributor: {
          ...messageForm.contributor,
          id: nanoid(8),
        },
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      }

      store.addMessage(message)

      // Reset form
      setMessageForm({
        type: 'letter',
        greeting: '',
        content: '',
        closing: '',
        signature: '',
        title: '',
        postscript: '',
        contributor: { name: '', email: '' },
      })
    }

    const canProceed = store.messages.length >= 1

    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Add Messages</h2>
        <p className="text-body text-warmCream-700 mb-8">Write at least 1 heartfelt message</p>

        {/* Message Form */}
        <div className="bg-warmCream-50 rounded-xl p-8 border-2 border-warmCream-300 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Message Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="messageType"
                    value="letter"
                    checked={messageForm.type === 'letter'}
                    onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                    className="w-5 h-5"
                  />
                  <span className="text-body font-body">Letter</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="messageType"
                    value="poem"
                    checked={messageForm.type === 'poem'}
                    onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                    className="w-5 h-5"
                  />
                  <span className="text-body font-body">Poem</span>
                </label>
              </div>
            </div>

            {messageForm.type === 'letter' && (
              <>
                <div>
                  <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Greeting</label>
                  <input
                    type="text"
                    value={messageForm.greeting}
                    onChange={(e) => setMessageForm({ ...messageForm, greeting: e.target.value })}
                    className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                    placeholder="Dear Emma,"
                  />
                </div>
              </>
            )}

            {messageForm.type === 'poem' && (
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Poem Title (optional)</label>
                <input
                  type="text"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="For Emma on Her 25th"
                />
              </div>
            )}

            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                {messageForm.type === 'letter' ? 'Message *' : 'Poem *'}
              </label>
              <textarea
                value={messageForm.content}
                onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                maxLength={2000}
                rows={10}
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none resize-none"
                placeholder={messageForm.type === 'letter' ? 'Write your heartfelt message...' : 'Write your poem (use line breaks)...'}
              />
            </div>

            {messageForm.type === 'letter' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Closing</label>
                    <input
                      type="text"
                      value={messageForm.closing}
                      onChange={(e) => setMessageForm({ ...messageForm, closing: e.target.value })}
                      className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                      placeholder="With love,"
                    />
                  </div>
                  <div>
                    <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Signature *</label>
                    <input
                      type="text"
                      value={messageForm.signature}
                      onChange={(e) => setMessageForm({ ...messageForm, signature: e.target.value })}
                      className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                      placeholder="Sarah"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Postscript (optional)</label>
                  <input
                    type="text"
                    value={messageForm.postscript}
                    onChange={(e) => setMessageForm({ ...messageForm, postscript: e.target.value })}
                    className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                    placeholder="P.S. - Can't wait to celebrate with you!"
                  />
                </div>
              </>
            )}

            {messageForm.type === 'poem' && (
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Signature *</label>
                <input
                  type="text"
                  value={messageForm.signature}
                  onChange={(e) => setMessageForm({ ...messageForm, signature: e.target.value })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="Sarah"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Contributor Name *</label>
                <input
                  type="text"
                  value={messageForm.contributor.name}
                  onChange={(e) => setMessageForm({ ...messageForm, contributor: { ...messageForm.contributor, name: e.target.value } })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Contributor Email (optional)</label>
                <input
                  type="email"
                  value={messageForm.contributor.email}
                  onChange={(e) => setMessageForm({ ...messageForm, contributor: { ...messageForm.contributor, email: e.target.value } })}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <button
              onClick={handleAddMessage}
              className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center gap-2"
            >
              <Plus size={20} /> Add Message
            </button>
          </div>
        </div>

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
            className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={() => store.nextStep()}
            disabled={!canProceed}
            className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-gold transition-all flex items-center gap-2"
          >
            Next <ArrowRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  // Step 4: Celebration Wishes
  const Step4 = () => {
    const [newWish, setNewWish] = useState('')

    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Celebration Wishes</h2>
        <p className="text-body text-warmCream-700 mb-8">These phrases will float across the screen during the celebration</p>

        <div className="space-y-4 mb-8">
          {store.celebrationWishPhrases.map((phrase, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={phrase}
                onChange={(e) => store.updateWishPhrase(index, e.target.value)}
                maxLength={50}
                className="flex-1 bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
              />
              <button
                onClick={() => store.removeWishPhrase(index)}
                className="p-3 bg-fadedRose/20 text-fadedRose rounded-lg hover:bg-fadedRose/30 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            maxLength={50}
            placeholder="Add a new wish..."
            className="flex-1 bg-warmCream-50 border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newWish.trim()) {
                store.addWishPhrase(newWish)
                setNewWish('')
              }
            }}
          />
          <button
            onClick={() => {
              if (newWish.trim()) {
                store.addWishPhrase(newWish)
                setNewWish('')
              }
            }}
            className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Add
          </button>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => store.previousStep()}
            className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={() => store.nextStep()}
            className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold hover:shadow-colored-gold transition-all flex items-center gap-2"
          >
            Next <ArrowRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  // Step 5: Preview
  const Step5 = () => {
    // Create a preview WishBloom object
    const previewData = {
      recipientName: store.recipientName,
      age: store.age,
      creativeAgeDescription: store.creativeAgeDescription,
      introMessage: store.introMessage,
      memories: store.memories,
      messages: store.messages,
      celebrationWishPhrases: store.celebrationWishPhrases,
      contributors: [], // Will be calculated
      createdDate: new Date().toISOString(),
    }

    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Preview Your WishBloom</h2>
          <p className="text-body text-warmCream-700">Review everything before publishing</p>
        </div>

        {/* Preview */}
        <div className="bg-warmCream-100 rounded-2xl overflow-hidden shadow-dramatic mb-8">
          <Hero
            recipientName={previewData.recipientName}
            age={previewData.age}
            creativeAgeDescription={previewData.creativeAgeDescription}
          />
          <IntroMessage message={previewData.introMessage} />
          <MemoryGallery memories={previewData.memories} />
          <MessagesSection messages={previewData.messages} />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => store.previousStep()}
            className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={() => store.nextStep()}
            className="px-12 py-6 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-2xl text-h5 font-heading font-bold shadow-dramatic hover:shadow-colored-gold transition-all"
          >
            Publish WishBloom ✨
          </button>
        </div>
      </div>
    )
  }

  // Step 6: Publish
  const Step6 = () => {
    const [emailForm, setEmailForm] = useState({
      recipientEmail: '',
      customMessage: '',
    })
    const [sendingEmail, setSendingEmail] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handlePublish = async () => {
      setPublishing(true)
      setPublishError(null)

      try {
        const response = await fetch('/api/wishblooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientName: store.recipientName,
            age: store.age,
            creativeAgeDescription: store.creativeAgeDescription,
            introMessage: store.introMessage,
            createdBy: store.createdBy,
            memories: store.memories,
            messages: store.messages,
            celebrationWishPhrases: store.celebrationWishPhrases,
          }),
        })

        const data = await response.json()

        if (data.success) {
          const fullUrl = `${window.location.origin}/${data.wishbloom.uniqueUrl}`
          setPublishedUrl(fullUrl)
        } else {
          setPublishError(data.error || 'Failed to publish')
        }
      } catch (error) {
        setPublishError('Failed to publish. Please try again.')
        console.error('Publish error:', error)
      } finally {
        setPublishing(false)
      }
    }

    const handleSendEmail = async () => {
      if (!emailForm.recipientEmail) {
        alert('Please enter recipient email')
        return
      }

      setSendingEmail(true)

      try {
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: emailForm.recipientEmail,
            recipientName: store.recipientName,
            wishbloomUrl: publishedUrl,
            senderName: store.createdBy.name,
            customMessage: emailForm.customMessage,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setEmailSent(true)
        } else {
          alert('Failed to send email: ' + (data.error || 'Unknown error'))
        }
      } catch (error) {
        alert('Failed to send email. Please try again.')
        console.error('Email error:', error)
      } finally {
        setSendingEmail(false)
      }
    }

    // Auto-publish on mount
    useEffect(() => {
      if (!publishing && !publishedUrl && !publishError && store.currentStep === 6) {
        handlePublish()
      }
    }, [])

    if (publishing) {
      return (
        <div className="max-w-3xl mx-auto text-center py-20">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 mx-auto mb-8"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-fadedGold">
              <circle cx="50" cy="50" r="15" fill="currentColor" />
              {Array.from({ length: 8 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="25"
                  rx="10"
                  ry="20"
                  fill="currentColor"
                  opacity="0.85"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </svg>
          </motion.div>
          <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Creating Your WishBloom...</h2>
          <p className="text-body font-body text-warmCream-700">Pressing the flowers, preserving the memories ✨</p>
        </div>
      )
    }

    if (publishError) {
      return (
        <div className="max-w-3xl mx-auto text-center py-20">
          <h2 className="text-h2 font-heading font-bold text-fadedRose mb-4">Oops! Something went wrong</h2>
          <p className="text-body font-body text-warmCream-700 mb-8">{publishError}</p>
          <button
            onClick={handlePublish}
            className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold hover:shadow-colored-gold transition-all"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (publishedUrl) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h1 font-heading font-bold text-sepiaInk mb-4">✨ WishBloom Created! ✨</h2>
            <p className="text-body-lg font-body text-warmCream-700">Your beautiful memory collection is ready to share</p>
          </div>

          {/* Published URL */}
          <div className="bg-warmCream-50 rounded-2xl p-8 border-4 border-fadedGold/60 shadow-dramatic mb-8">
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-3 block">Your Unique WishBloom URL</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={publishedUrl}
                readOnly
                className="flex-1 bg-white border-2 border-warmCream-300 rounded-lg px-4 py-3 text-body font-mono outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl)
                  alert('Link copied to clipboard!')
                }}
                className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Email notification */}
          <div className="bg-warmCream-50 rounded-2xl p-8 border-2 border-warmCream-300 mb-8">
            <h3 className="text-h5 font-heading font-bold text-sepiaInk mb-4">Send to Recipient</h3>
            {!emailSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Recipient Email</label>
                  <input
                    type="email"
                    value={emailForm.recipientEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                    className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                    placeholder="emma@example.com"
                  />
                </div>
                <div>
                  <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">Personal Message (optional)</label>
                  <textarea
                    value={emailForm.customMessage}
                    onChange={(e) => setEmailForm({ ...emailForm, customMessage: e.target.value })}
                    maxLength={300}
                    rows={3}
                    className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none resize-none"
                    placeholder="Add a personal note..."
                  />
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="px-6 py-3 bg-burntSienna text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-gold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingEmail ? <Loader2 size={20} className="animate-spin" /> : null}
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✔️</div>
                <p className="text-body-lg font-body text-mossGreen font-semibold">Email sent successfully!</p>
              </div>
            )}
          </div>

          {/* Share & View buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.open(publishedUrl, '_blank')}
              className="px-8 py-4 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-xl text-h6 font-heading font-bold shadow-dramatic hover:shadow-colored-gold transition-all"
            >
              View WishBloom ✨
            </button>
            <button
              onClick={() => {
                store.resetStore()
                router.push('/')
              }}
              className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  // Render current step
  const renderStep = () => {
    switch (store.currentStep) {
      case 1:
        return <Step1 />
      case 2:
        return <Step2 />
      case 3:
        return <Step3 />
      case 4:
        return <Step4 />
      case 5:
        return <Step5 />
      case 6:
        return <Step6 />
      default:
        return <Step1 />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-warmCream-100 to-rosePetal/10 py-16 px-4 md:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-h1 md:text-display font-heading font-bold text-sepiaInk mb-4">
          Create a WishBloom
        </h1>
        <p className="text-body-lg font-body text-warmCream-700">
          Preserve memories, one bloom at a time
        </p>
      </div>

      {/* Progress Stepper */}
      {store.currentStep < 6 && (
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Info' },
              { step: 2, label: 'Memories' },
              { step: 3, label: 'Messages' },
              { step: 4, label: 'Wishes' },
              { step: 5, label: 'Preview' },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-heading font-bold text-h6 transition-all ${
                      store.currentStep === item.step
                        ? 'bg-fadedGold text-white scale-110'
                        : store.currentStep > item.step
                        ? 'bg-mossGreen text-white'
                        : 'bg-warmCream-300 text-warmCream-600'
                    }`}
                  >
                    {store.currentStep > item.step ? <Check size={24} /> : item.step}
                  </div>
                  <span className="text-caption md:text-body-sm font-body mt-2 text-center">
                    {item.label}
                  </span>
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      store.currentStep > item.step ? 'bg-mossGreen' : 'bg-warmCream-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={store.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}