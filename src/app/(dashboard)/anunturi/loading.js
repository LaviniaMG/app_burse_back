'use client';

import Loader from  '../../../components/Loader';
import AuthGuard from '../../../utils/route-guard/AuthGuard';
export default function Loading() {
  return (<AuthGuard allowedRoles={['student']} ><Loader /></AuthGuard>);
}
