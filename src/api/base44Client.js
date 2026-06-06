import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const TABLE_MAP = {
  Property: 'property',
  Venue: 'venue',
  Booking: 'booking',
}

const mapUser = (authUser, profile = {}) => {
  if (!authUser) return null
  return {
    id: authUser.id,
    email: authUser.email,
    full_name: profile.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.office_name || '',
    office_name: profile.office_name || authUser.user_metadata?.office_name || '',
    business_type: profile.business_type || authUser.user_metadata?.business_type || '',
    phone: profile.phone || authUser.user_metadata?.phone || '',
    city: profile.city || authUser.user_metadata?.city || '',
    role: profile.role || authUser.user_metadata?.role || 'user',
    ...profile,
  }
}

const getProfile = async (userId) => {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return data || {}
  } catch {
    return {}
  }
}

const makeEntity = (entityName) => {
  const table = TABLE_MAP[entityName]
  return {
    filter: async (conditions = {}, sort) => {
      let query = supabase.from(table).select('*')
      for (const [key, value] of Object.entries(conditions)) {
        query = query.eq(key, value)
      }
      if (sort) {
        const desc = sort.startsWith('-')
        const col = desc ? sort.slice(1) : sort
        query = query.order(col, { ascending: !desc })
      }
      const { data, error } = await query
      if (error) throw error
      return data || []
    },
    list: async (sort) => {
      let query = supabase.from(table).select('*')
      if (sort) {
        const desc = sort.startsWith('-')
        const col = desc ? sort.slice(1) : sort
        query = query.order(col, { ascending: !desc })
      }
      const { data, error } = await query
      if (error) throw error
      return data || []
    },
    get: async (id) => {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
      if (error) throw error
      return data
    },
    create: async (payload) => {
      const clean = { ...payload }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        if (!clean.created_by_id) clean.created_by_id = user.id
        if (!clean.created_by) clean.created_by = user.email
        if (!clean.owner_id) clean.owner_id = user.id
      }
      // تنظيف القيم الفارغة
      Object.keys(clean).forEach(k => {
        if (clean[k] === undefined) delete clean[k]
      })
      const { data, error } = await supabase.from(table).insert(clean).select()
      if (error) {
        alert('خطأ في الحفظ: ' + error.message)
        throw error
      }
      return data?.[0]
    },
    update: async (id, payload) => {
      const clean = { ...payload }
      Object.keys(clean).forEach(k => {
        if (clean[k] === undefined) delete clean[k]
      })
      const { data, error } = await supabase.from(table).update(clean).eq('id', id).select()
      if (error) {
        alert('خطأ في التحديث: ' + error.message)
        throw error
      }
      return data?.[0]
    },
    delete: async (id) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return { success: true }
    },
  }
}

const userEntity = {
  filter: async (conditions = {}) => {
    let query = supabase.from('profiles').select('*')
    for (const [key, value] of Object.entries(conditions)) {
      query = query.eq(key, value)
    }
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
  get: async (id) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
}

export const base44 = {
  entities: {
    Property: makeEntity('Property'),
    Venue: makeEntity('Venue'),
    Booking: makeEntity('Booking'),
    User: userEntity,
  },

  auth: {
    me: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) throw new Error('Not authenticated')
      const profile = await getProfile(user.id)
      return mapUser(user, profile)
    },
    loginViaEmailPassword: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    },
    loginWithProvider: async (provider, redirectPath = '/') => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectPath}` },
      })
      if (error) throw error
    },
    register: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return data
    },
    verifyOtp: async ({ email, otpCode }) => {
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' })
      if (error) throw error
      return { access_token: data?.session?.access_token }
    },
    resendOtp: async (email) => {
      const { error } = await supabase.auth.resend({ email, type: 'signup' })
      if (error) throw error
    },
    setToken: () => {},
    updateMe: async (updates) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, email: user.email, ...updates })
      if (error) throw error
      return updates
    },
    resetPasswordRequest: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    },
    resetPassword: async ({ newPassword }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
    },
    logout: async (redirectUrl) => {
      await supabase.auth.signOut()
      if (redirectUrl) window.location.href = redirectUrl
    },
    redirectToLogin: () => {
      window.location.href = '/login'
    },
  },

  functions: {
    invoke: async () => {
      return { data: { error: 'الميزة غير متاحة حالياً' } }
    },
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const { error } = await supabase.storage.from('images').upload(fileName, file)
        if (error) throw error
        const { data } = supabase.storage.from('images').getPublicUrl(fileName)
        return { file_url: data.publicUrl }
      },
    },
  },
}
