'use client'
import HeaderBasic from '@/components/cv-rating-card/router-page/basic/header-basic'
import InputDate from '@/components/cv-rating-card/router-page/basic/input-date-field'
import SkeletonLoader from '@/components/cv-rating-card/router-page/basic/skeleton'
import InputDateField from '@/components/input-date/Input-date'
import InputComponent from '@/components/input-field/input-component'
import axiosInstance from '@/utils/axios'
import React, { useEffect, useState } from 'react'
import { Sheet } from 'react-modal-sheet'

const Page = () => {
  const [surname, setSurname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [career, setCareer] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPut,setIsPut]=useState<boolean>(false)
  useEffect(() => {
    async function GetData() {
      try {
        setLoading(true);
        const data = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/user/basic/`,
        );
        setLoading(true);
        const res = data.data;
        setEmail(res.email);
        setLastname(res.username.split(" ").slice(1).join(" "));
        setSurname(res.username.split(" ")[0]);
        setCareer(res.career)
        setPhone(res.phone_number);
        setDate(res.dob);
        setAddress(res.address);
        setStatus(res.martital_status);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    GetData();
  }, []);

  const PostData = async () => {
    try {
      const userData = {
        surName: surname,
        lastName: lastname,
        career,
        email,
        phonenumber: phone, 
        dob: date, // Date of birth from state
        address, // Address from state
        martital_status: status, // Marital status from state
        role: "", // Adjust or replace with the actual value
      };
      console.log("Data",userData)
      setLoading(true);
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/user/profile/`,
        userData );
      return response;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <HeaderBasic
        title="Portfilo"
        nextRoute={"/self/educ"}
        {...(isPut ? { next: PostData } : {})}
      />
    {loading&&<SkeletonLoader text="Loading ..." />}
    <div className="pb-20">
      <InputComponent
        typeofInput="text"
        values={surname}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Sur Name"
        setValues={(value)=>{
          setSurname(value)
          value!=surname||setIsPut(true)
          
        }}
        valuesFouce="surname"
      />
      <InputComponent
        typeofInput="text"
        values={lastname}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Last Name"
        setValues={(value)=>{
          setLastname(value)
          value!=lastname||setIsPut(true)
        }
        }
        valuesFouce="lastname"
      />
      <InputComponent
        values={career}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Career"
        setValues={(value)=>{
          setCareer(value)
          value!=career||setIsPut(true)
        }}
        valuesFouce="carer"
      />
      <InputComponent
        values={email}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Email"
        setValues={(value)=>{
          setEmail(value)
          value!=email||setIsPut(true)
        }}
        valuesFouce="email"
      />
      <InputDateField placeHolder="Date Of Birth" 
      setOpen={() => setOpen(true)}
       date={date}
       
       />
      <InputComponent
        values={phone}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Phone"
        setValues={(value)=>{
          setPhone(value)
          value!=phone||setIsPut(true)
        }}
        valuesFouce="phone"
      />
      <InputComponent
        values={address}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Adress"
        setValues={(value)=>{
          setAddress(value)
          value!=address||setIsPut(true)
        }}
        valuesFouce="address"
      />
      <InputComponent
        values={status}
        setFocused={setFocusedField}
        focused={focusedField}
        txt="Martail Status"
        setValues={(value)=>{
          setStatus(value)
          value!=status||setIsPut(true)
        }}
        valuesFouce="Status"
      />

      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[400, 200, 100, 0]}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <InputDate
              mode="date"
              setOpen={setOpen}
              setDay={setDay}
              day={day}
              setMonth={setMonth}
              month={month}
              setYear={setYear}
              year={year}
              setValue={setDate}
              setIsPut={setIsPut}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
    </div>
  );
  
}

export default Page
