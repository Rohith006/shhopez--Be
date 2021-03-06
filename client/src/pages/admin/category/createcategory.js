import React,{ useState, useEffect } from "react";
import AdminNav from "../../../components/nav/adminnav"
import { toast } from "react-toastify"
import { useSelector } from 'react-redux'
import { createCategory, getCategories, removeCategory} from "../../../function/category"

import { Link } from "react-router-dom"
import {EditOutlined, DeleteOutlined } from '@ant-design/icons'
import CategoryFrom from '../../../components/form/categoryForm'
import SearchForm from '../../../components/form/searchForm'



const CategoryCreate = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [ keyword, setKeyword] = useState("")

    useEffect(() => {
      loadCategories();
    }, []);

    const loadCategories = () =>
      getCategories().then((c) => setCategories(c.data));

    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(name);
      setLoading(true);
      createCategory({ name }, user.token)
        .then((res) => {
          // console.log(res)
          setLoading(false);
          setName("");
          toast.success(`"${res.data.name}" is created`);
          loadCategories();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          if (err.response.status === 400) toast.error(err.response.data);
        });
    };

    const handleRemove = async (slug) => {
      // let answer = window.confirm("Delete?");
      // console.log(answer, slug);
      if (window.confirm("Delete?")) {
        setLoading(true);
        removeCategory(slug, user.token)
          .then((res) => {
            setLoading(false);
            toast.error(`${res.data.name} deleted`);
            loadCategories();
          })
          .catch((err) => {
            if (err.response.status === 400) {
              setLoading(false);
              toast.error(err.response.data);
            }
          });
      }
    };

    // const handleSearch = (e) =>{
    //   e.preventDefault();
    //   setKeyword(e.target.value.toLowerCase());
    // }

    const searchedItem = (keyword) => (c) => c.name.toLowerCase().includes(keyword);


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Create category</h4>
            )}
            <CategoryFrom 
                handleSubmit = {handleSubmit}
                name={name}
                setName = {setName}
            />
            <SearchForm 
              keyword={keyword}
              setKeyword = {setKeyword}
            />
            {/* <input 
              type = "search"
              className="form-control mb-4"
              value={keyword}
              placeholder="Search"
              onChange={handl eSearch}
            /> */}
            <hr />
            {categories.filter(searchedItem(keyword)).map((c) => (
              <div className="alert alert-secondary" key={c._id}>
                {c.name}
                <span
                  onClick={() => handleRemove(c.slug)}
                  className="btn btn-sm float-right"
                >
                  <DeleteOutlined className="text-danger" />
                </span>
                <Link to={`/admin/category/${c.slug}`}>
                  <span className="btn btn-sm float-right">
                    <EditOutlined className="text-warning" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default CategoryCreate;

// my code get category error

// const CategoryCreate = () => {

//   const { user } = useSelector((state) => ({...state}))

//   const [name, setName] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [categories, setCategories] = useState([])

//   useEffect(() => {
//     // allcategories =  getCategories().then((c) => setCategories(c.data))
//     allcategories()
//   }, [])

//   const allcategories = () => getCategories().then((c) => setCategories(c.data))
//   console.log(">>>>>",allcategories())
  
//   const handleSubmit= (e) => {
//     e.preventDefault()
//     // console.log("name>>>>",name)
//     setLoading(true)
//     createCategory({name}, user.token)
//       .then((res) => {
//         // console.log("res>>>>", res)
//         setLoading(false)
//         setName('')
//         toast.success(`"${res.data.name}" is craeted`)
//         allcategories()
//       })
//       .catch((err) => {
//         // console.log("er>>>>", err)
//         setLoading(false)
//         if(err.response.status === 400) toast.error(err.response.data)
//       });
//   }

//   const handleRemove = (slug) =>{
//     // let ans =(window.confirm(`Are you sure you want to delete ${slug} item`))
//     // console.log(ans, slug)
//       if(window.confirm('Are you sure you want to delete')){
//         setLoading(true)
//         removeCategory(slug, user.token)
//         .then((res)=>{
//           setLoading(false)
//           toast.error(`successfully you deleted ${res.data.name} item`)
//           allcategories()
//         })
//         .catch((err) => {
//           if (err.response.status === 400) {
//             setLoading(false);
//             toast.error(err.response.data);
//           }
//         })
//       }
//     }
  

//   const categoryForm = () => <form onSubmit={handleSubmit}>
//      <div className="form-group">
//       <label>Name</label>
//       <input
//           type="text"
//           className="form-control"
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           autoFocus
//           required
//         />
//         <br />
//       <button className="btn btn-outline-primary">SAVE</button>
//      </div>
//   </form>


//   return (
//       <div className="container-fluid">
//           <div className="row">
//             <div className="col-md-2">
//               <AdminNav />
//             </div>
//             <div className="col">
//               {loading ? (
//                 <h4 className="text-danger">Loading...</h4>
//               ):(
//                 <h4>Category Form</h4> 
//               )}
//               {categoryForm()}
//               <hr />
              
//               {categories.map((c) => (
//                 <div className="alert alert-secondary" key={c._id}>
//                   {c.name}
//                   {/* <span
//                     onClick={() => handleRemove(c.slug)}
//                     className="btn btn-sm float-right"
//                   >
//                     <DeleteOutlined className="text-danger" />
//                   </span>
//                   <Link to={`/admin/category/${c.slug}`}>
//                     <span className="btn btn-sm float-right">
//                       <EditOutlined className="text-warning" />
//                     </span>
//                   </Link> */}
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
    
//   );
// };

// export default CategoryCreate;

