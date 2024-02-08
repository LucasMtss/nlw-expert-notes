import { ChangeEvent, useEffect, useState } from 'react'
import logo from './assets/logo.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import { INoteCard } from './interfaces/note-card-interface';

export function App() {
  const [notes, setNotes] = useState<INoteCard[]>([] as INoteCard[]);
  const [filteredNotes, setFilteredNotes] = useState<INoteCard[]>([] as INoteCard[]);

  useEffect(() => {
    const notesInLocalStorage = localStorage.getItem('notes')
    if(notesInLocalStorage){
      setNotes(JSON.parse(notesInLocalStorage))
      setFilteredNotes(JSON.parse(notesInLocalStorage))
    }
  }, [])

  function onNoteCreated(content: string){
    const newNote: INoteCard = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content
    }
    const notesList = [...notes, newNote]

    setNotes(notesList)
    setFilteredNotes(notesList)

    localStorage.setItem('notes', JSON.stringify(notesList))
  }

  function onNoteDeleted(id: string){
    const filteredNotes = notes.filter(note => note.id !== id)

    setNotes(filteredNotes)
    setFilteredNotes(filteredNotes)
    localStorage.setItem('notes', JSON.stringify(filteredNotes))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    const filteredNotesList = query.length ? notes.filter(note => note.content.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : notes
  
    setFilteredNotes(filteredNotesList);
  }

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt="NLW Expert" />
      <form className='w-full'>
        <input 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none' 
          type="text" 
          placeholder='Busque em suas notas...'
          onChange={handleSearch}/>
      </form>
      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        {
          filteredNotes.map(note => {
            return (
              <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note}/>
            )
          })
        }
      </div>
    </div>
  )
}