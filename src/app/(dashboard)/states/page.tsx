"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  PageHeader, 
  SearchBar, 
  LoadingSpinner, 
  Alert, 
  Table, 
  ActionButtonGroup,
  ConfirmDialog,
  EmptyState,
  StatsCard 
} from "@/components/ui";
import { StateResponse } from "@/types/api";
import { statesService } from "@/services/states.service";


const StatePage = () => {
  const [states, setStates] = useState<StateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<StateResponse | null>(null);
  
  return (
    <></>
   );
};

export default StatePage;