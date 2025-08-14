import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  //Request interceptor
  axiosSecure.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  //Response interceptor with SweetAlert + delayed logout
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized Access",
          text: "You don't have permission to access this content.",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Wait 5 seconds, then log out and redirect
        setTimeout(async () => {
          navigate("/");
        }, 3000);
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
