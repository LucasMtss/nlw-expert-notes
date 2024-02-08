import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor(){
    setShouldShowOnboarding(false)
  }

  function handleHideEditor(){
    setContent('')
    setShouldShowOnboarding(true)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)
    if(!event.target.value.length){
      handleHideEditor()
    }
  }

  function handleSaveNote(event: FormEvent){
    event.preventDefault()
    if(!content.length) return
    toast.success('Nota criada com sucesso!')
    onNoteCreated(content)
    handleHideEditor();
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvaible = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if(!isSpeechRecognitionAPIAvaible) {
      alert('Infelizmente seu navegador não suporta a API de Gravação!')
      return
    }
    
    setIsRecording(true)
    setShouldShowOnboarding(false)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')
      setContent(transcription)
      
    }

    speechRecognition.onerror = (event) => {
      console.error(event.error)
    }

    speechRecognition.start()
  }

  function handleStopRecording(event: FormEvent) {
    event.preventDefault()
    setIsRecording(false)
    if(speechRecognition) speechRecognition.stop()
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col rounded-md bg-slate-700 p-5 gap-3 text-left overflow-hidden relative hover:ring-2 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
          <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
          <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
      </Dialog.Trigger>
      <Dialog.Portal>
            <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
            <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-[60vh] md:max-w-[640px] w-full bg-slate-700 md:rounded-md flex flex-col outline-none'>
                <Dialog.Close onClick={() => handleHideEditor()} className='absolute right-0 bg-slate-800 p-1.5 text-slate-400'>
                    <X className='size-5 hover:text-slate-300'/>
                </Dialog.Close>
                <form className='flex-1 flex flex-col'>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                      <span className='text-sm font-medium text-slate-300'>
                          Adicionar nota
                      </span>
                      {
                        shouldShowOnboarding ? (
                          <p className='text-sm leading-6 text-slate-400'>
                          Comece <button type='button' onClick={handleStartRecording} className='font-medium hover:underline text-lime-400'>gravando uma nota</button> em áudio ou se preferir <button type='button' className='font-medium hover:underline text-lime-400' onClick={() => handleStartEditor()}>utilize apenas texto</button>.
                          </p>

                        ) : (
                          <textarea 
                            autoFocus 
                            className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                            onChange={handleContentChange}
                            value={content}
                          ></textarea>
                        )
                      }
                  </div>
                  {
                    isRecording ? (
                      <button onClick={handleStopRecording} type="button" className='font-medium w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none flex items-center justify-center gap-2 hover:bg-slate-100'>
                          <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                          Gravando (clique para interromper)
                      </button>
                    ) : (
                      <button onClick={handleSaveNote} type="submit" className='font-medium w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none hover:bg-lime-500'>
                            Salvar nota
                      </button>
                    )
                  }
                 
                  </form>
                
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}
