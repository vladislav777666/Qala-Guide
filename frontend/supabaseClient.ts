import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yncvoxwlinujkvpwegsa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluY3ZveHdsaW51amt2cHdlZ3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDI5NzksImV4cCI6MjA2NjA3ODk3OX0.duTbRKh4qPJcgTJBynmIyajICSyzNB6_VuM9R6OdmT0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)