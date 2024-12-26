// App.jsx
import React, { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AddNotePage from './pages/AddNotePage';
import NotesDetailPage from './pages/NotesDetailPage';
import EditNotePage from './pages/EditNotePage';
import axios from 'axios';
import { toast} from 'react-toastify';


const App = () => {

  const[notes,setNotes]=useState([])
  const[isloading,setIsloading]=useState(false)
  const [filterText,setFilterText]=useState('')
  const [searchText,setSearchText]=useState('')

  const handleSearchText=(val)=>{
    setSearchText(val)
  }
  
  const handleFilterText=(val)=>{
    setFilterText(val)
  }
  const filteredNotes=
  filterText === 'BUSINESS'
  ? notes.filter(note=>note.category =='BUSINESS')
  :filterText === 'PERSONAL'? notes.filter((note)=>note.category =='PERSONAL')
  :filterText === 'IMPORTANT'? notes.filter((note)=>note.category =='IMPORTANT')
  :notes

  useEffect(()=>{
    setIsloading(true)
    axios.get("http://127.0.0.1:8000/notes/")
    .then(res=>{
      console.log(res.data)
      setNotes(res.data)
      setIsloading(false)
    })
    .catch(err=>{
      console.log(err.message)
  })
  },[])

  useEffect(()=>{
    if(searchText.length<3) return;

    axios.get(`http://127.0.0.1:8000/notes-search/?search=${searchText}`)
    .then(res=>{
      console.log(res.data)
      setNotes(res.data)
    })
    .catch(err=>{
      console.log(err.message)
  })
  },[searchText])


  const addNote=(data)=>{
    axios.post('http://127.0.0.1:8000/notes/',data)
    .then(res=>{
      setNotes([...notes,data])
      toast.success("A new note has been added");
      console.log(res.data)
    })
    .catch(err=>{
      console.log(err.message)
  })
  }

  const updateNote=(data,slug)=>{
    axios.put(`http://127.0.0.1:8000/notes/${slug}/`,data)
    .then(res=>{
      console.log(res.data)
      toast.success('Notes updated successfully')
    })
    .catch(err=>console.log(err.message))
  }

  const deleteNote=(slug)=>{
    axios.delete(`http://127.0.0.1:8000/notes/${slug}/`)
    .then(res=>{
      setNotes([...notes])
    })
    .catch(err=>{console.log(err.message)})
  }


  const router=createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<MainLayout searchText={searchText} handleSearchText={handleSearchText}/>}> 
    <Route index element={<HomePage notes={filteredNotes} loading={isloading}  handleFilterText={handleFilterText}/>}/>
    <Route path='/add-note' element={<AddNotePage addNote={addNote}/>}/>
    <Route path='/notes/:slug' element={<NotesDetailPage deleteNote={deleteNote}/>}/>
    <Route path='/edit-note/:slug' element={<EditNotePage updateNote={updateNote}/>}/>
  </Route>
  
  ))
  return (
    <RouterProvider router={router}/>

  );
}

export default App;

// endpoints:
//  GET_ALL_NOTES and CREATE_NEW_NOTE= 'http://127.0.0.1:8000/notes/'
//  GET_ANY_ONE_NOTE and UPDATE, DELETE= 'http://127.0.0.1:8000/notes/slug/'
//  slug is in object(specific for each object)