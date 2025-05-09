
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { LivroJuridico } from '@/types/biblioteca-juridica';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BibliotecaFavoritosProps {
  onSelectBook: (book: LivroJuridico) => void;
}

export function BibliotecaFavoritos({ onSelectBook }: BibliotecaFavoritosProps) {
  const { user } = useAuth();
  
  // First query to get favorite books' IDs
  const { data: favorites, isLoading: loadingFavorites } = useQuery({
    queryKey: ['biblioteca-favoritos', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('biblioteca_leitura_progresso')
        .select('livro_id')
        .eq('user_id', user.id)
        .eq('favorito', true)
        .order('ultima_leitura', { ascending: false });
        
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      return data.map(item => item.livro_id);
    },
    enabled: !!user
  });
  
  // Second query to get the actual book details
  const { data: favoriteBooks, isLoading: loadingBooks } = useQuery({
    queryKey: ['biblioteca-favoritos-details', favorites],
    queryFn: async () => {
      if (!favorites || favorites.length === 0) return [];
      
      const { data, error } = await supabase
        .from('bibliotecatop')
        .select('*')
        .in('id', favorites as unknown as number[]);
        
      if (error) {
        console.error('Error fetching favorite books:', error);
        return [];
      }
      
      return data.map(book => ({
        id: book.id.toString(),
        titulo: book.titulo || 'Sem título',
        categoria: book.categoria || 'Geral',
        pdf_url: book.pdf_url || '',
        capa_url: book.capa_url || null,
        descricao: book.descricao || null,
        total_paginas: book.total_paginas ? parseInt(book.total_paginas) : null
      })) as LivroJuridico[];
    },
    enabled: !!favorites && favorites.length > 0
  });
  
  const isLoading = loadingFavorites || loadingBooks;
  
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] h-48 animate-pulse bg-muted rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-6 bg-muted/30 rounded-lg">
        <Bookmark className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
        <h3 className="text-lg font-medium">Sem favoritos</h3>
        <p className="text-muted-foreground">Faça login para salvar seus livros favoritos</p>
      </div>
    );
  }
  
  if (!favoriteBooks || favoriteBooks.length === 0) {
    return (
      <div className="text-center py-6 bg-muted/30 rounded-lg">
        <Bookmark className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
        <h3 className="text-lg font-medium">Nenhum favorito</h3>
        <p className="text-muted-foreground">Você ainda não adicionou livros aos favoritos</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {favoriteBooks.map((book) => (
        <Card 
          key={book.id} 
          className="cursor-pointer overflow-hidden border-primary/20 hover:border-primary/40 transition-colors"
          onClick={() => onSelectBook(book)}
        >
          <CardContent className="p-0">
            <div className="aspect-[3/4] relative bg-muted">
              {book.capa_url ? (
                <img 
                  src={book.capa_url} 
                  alt={book.titulo}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-book-cover.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
              
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary shadow-sm">
                  <Bookmark className="h-3 w-3 mr-1" /> Favorito
                </Badge>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium line-clamp-1">{book.titulo}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {book.categoria}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
