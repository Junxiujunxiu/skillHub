import Loading from '@/components/Loading';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { useGetCourseQuery } from '@/state/api';
import { useSearchParams } from 'next/navigation';
import React, { use } from 'react'

const CheckoutDetailsPage = () => {
    const { course: selectedCourse, isLoading, isError } = useCurrentCourse()
    const searchParams = useSearchParams();
    const showSignUp = searchParams.get("showSignUp") === "true";

    if(isLoading) return <Loading />;
    if(isError) return <div>Failed to fetch course data</div>;
    if(!selectedCourse) return <div>No course found</div>;

  return (
    <div>CheckoutDetailsPage</div>
  )
}

export default CheckoutDetailsPage