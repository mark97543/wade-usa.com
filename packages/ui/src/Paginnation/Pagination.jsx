import React from 'react';
import './Pagination.css'

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
            <button key={number} onClick={() => paginate(number)} href='!#' className='page-link'>
              {number}
            </button>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

// Need to Add these to page you want to work:

//   const [posts, setPosts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [postsPerPage] = useState(10);

//   // Get current posts
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

//   // Change page
//   const paginate = pageNumber => setCurrentPage(pageNumber);


//   <Pagination
//     postsPerPage={postsPerPage}
//     totalPosts={posts.length}
//     paginate={paginate}
//   />