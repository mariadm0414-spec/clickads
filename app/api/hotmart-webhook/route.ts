// (He simplificado la lógica para que solo use authorized_users como pediste)
if (event === 'PUR_APPROVED') {
    await supabase.from('authorized_users').upsert({
        email: email,
        status: 'active',
        updated_at: new Date().toISOString()
    }, { onConflict: 'email' });
} else if (event === 'PUR_REFUNDED' || event === 'PUR_CANCELED') {
    await supabase.from('authorized_users').update({
        status: 'inactive'
    }).eq('email', email);
}
