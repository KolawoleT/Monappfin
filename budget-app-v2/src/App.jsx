import { useState, useEffect } from 'react';

const CHARGES_FIXES = [
  { id: 1, name: 'Loyer', amount: 60600, icon: '🏠' },
  { id: 2, name: 'Connexion Internet', amount: 15000, icon: '📡' },
  { id: 3, name: 'Vidange moto', amount: 5000, icon: '🏍️' },
  { id: 4, name: 'Carburant', amount: 10000, icon: '⛽' },
  { id: 5, name: 'Eau et électricité', amount: 12000, icon: '⚡' },
  { id: 6, name: 'Popote Simi', amount: 50500, icon: '🍽️' },
  { id: 7, name: 'Don à Mum', amount: 20000, icon: '❤️' },
  { id: 8, name: 'Dépenses personnelles', amount: 40000, icon: '👛' },
];

const MONTHLY_ALLOCATION = {
  salaire: 310000,
  charges: 213100,
  buffer: 20000,
  savingsUrgent: 40000,
  investment: 36900,
};

const fmt = (n) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' F';

export default function App() {
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('wallets_v2');
    return saved ? JSON.parse(saved) : {
      courant: 310000,
      savingsUrgent: 0,
      investment: 0,
    };
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [customType, setCustomType] = useState('expense');

  useEffect(() => {
    localStorage.setItem('wallets_v2', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  const monthTransactions = transactions.filter((t) => t.month === month).sort((a, b) => new Date(b.date) - new Date(a.date));
  const hasChargesThisMonth = monthTransactions.some((t) => t.type === 'charges_fixes');

  const addMonthlyAllocation = () => {
    if (hasChargesThisMonth) {
      alert('Charges déjà enregistrées pour ce mois');
      return;
    }

    const newTransactions = [
      ...transactions,
      {
        id: Date.now(),
        type: 'charges_fixes',
        amount: MONTHLY_ALLOCATION.charges,
        month,
        date: new Date().toISOString().split('T')[0],
        label: 'Charges fixes du mois',
      },
    ];
    setTransactions(newTransactions);

    setWallets((prev) => ({
      ...prev,
      courant: prev.courant - MONTHLY_ALLOCATION.charges,
      savingsUrgent: prev.savingsUrgent + MONTHLY_ALLOCATION.savingsUrgent,
      investment: prev.investment + MONTHLY_ALLOCATION.investment,
    }));
  };

  const addIncome = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      alert('Montant invalide');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: 'income',
      amount,
      month,
      date: new Date().toISOString().split('T')[0],
      label: customLabel || 'Revenu',
    };
    setTransactions([newTransaction, ...transactions]);
    setWallets((prev) => ({ ...prev, courant: prev.courant + amount }));
    setCustomAmount('');
    setCustomLabel('');
    setShowAddModal(false);
  };

  const addExpense = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      alert('Montant invalide');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      amount,
      month,
      date: new Date().toISOString().split('T')[0],
      label: customLabel || 'Dépense',
    };
    setTransactions([newTransaction, ...transactions]);
    setWallets((prev) => ({ ...prev, courant: prev.courant - amount }));
    setCustomAmount('');
    setCustomLabel('');
    setShowAddModal(false);
  };

  const deleteTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    setTransactions(transactions.filter((t) => t.id !== id));

    if (transaction.type === 'income') {
      setWallets((prev) => ({ ...prev, courant: prev.courant - transaction.amount }));
    } else if (transaction.type === 'expense' || transaction.type === 'charges_fixes') {
      setWallets((prev) => ({ ...prev, courant: prev.courant + transaction.amount }));
    }
  };

  const urgentProgress = (wallets.savingsUrgent / 200000) * 100;
  const investmentProgress = (wallets.investment / 150000) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to br, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      maxWidth: '500px',
      margin: '0 auto',
      paddingBottom: '120px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0e14; }
      `}</style>

      {/* Header */}
      <div style={{ padding: '24px 20px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Portefeuille</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Suivi budgétaire • {month}</p>
      </div>

      {/* Wallets */}
      <div style={{ padding: '20px' }}>
        {/* Compte Courant */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(249,115,22,0.1) 100%)',
          border: '1px solid rgba(251,146,60,0.3)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💳 Compte Courant</p>
              <p style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px', color: '#fed7aa' }}>{fmt(wallets.courant)}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px' }}>
              <p style={{ color: '#fbbf24', fontWeight: '600' }}>+{fmt(MONTHLY_ALLOCATION.buffer)}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Buffer</p>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '12px' }}>
            Charges: {fmt(MONTHLY_ALLOCATION.charges)} | Reste: {fmt(wallets.courant)}
          </div>
        </div>

        {/* Épargne Urgence */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.1) 100%)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🛡️ Épargne Urgence</p>
              <p style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px', color: '#86efac' }}>{fmt(wallets.savingsUrgent)}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px' }}>
              <p style={{ color: '#4ade80', fontWeight: '600' }}>Objectif: {fmt(200000)}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>{Math.round(urgentProgress)}%</p>
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '12px',
          }}>
            <div style={{
              width: `${Math.min(urgentProgress, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e 0%, #86efac 100%)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Investissement */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.1) 100%)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💎 Investissement</p>
              <p style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px', color: '#bfdbfe' }}>{fmt(wallets.investment)}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px' }}>
              <p style={{ color: '#3b82f6', fontWeight: '600' }}>Objectif: {fmt(150000)}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>{Math.round(investmentProgress)}%</p>
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '12px',
          }}>
            <div style={{
              width: `${Math.min(investmentProgress, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #bfdbfe 100%)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={addMonthlyAllocation}
            disabled={hasChargesThisMonth}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(248,113,113,0.3)',
              background: hasChargesThisMonth ? 'rgba(0,0,0,0.2)' : 'rgba(248,113,113,0.1)',
              color: hasChargesThisMonth ? 'rgba(255,255,255,0.3)' : '#f87171',
              fontWeight: '700',
              cursor: hasChargesThisMonth ? 'not-allowed' : 'pointer',
              fontSize: '13px',
            }}
          >
            {hasChargesThisMonth ? '✓ Charges du mois' : '+ Charges du mois'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.1)',
              color: '#818cf8',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            + Transaction
          </button>
        </div>

        {/* Transactions */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Transactions</h3>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          {monthTransactions.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              Aucune transaction ce mois
            </div>
          ) : (
            <div>
              {monthTransactions.map((tx) => (
                <div key={tx.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '13px' }}>{tx.label}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{tx.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <p style={{
                      color: tx.type === 'income' ? '#4ade80' : '#f87171',
                      fontWeight: '700',
                      fontSize: '13px',
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </p>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0 4px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Charges */}
      {showChargesModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 100,
        }} onClick={() => setShowChargesModal(false)}>
          <div style={{
            width: '100%',
            background: '#1a1a2e',
            borderRadius: '20px 20px 0 0',
            padding: '24px 20px 32px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Charges fixes prédéfinies</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {CHARGES_FIXES.map((charge) => (
                <button
                  key={charge.id}
                  onClick={() => {
                    setTransactions([
                      {
                        id: Date.now(),
                        type: 'expense',
                        amount: charge.amount,
                        month,
                        date: new Date().toISOString().split('T')[0],
                        label: charge.name,
                      },
                      ...transactions,
                    ]);
                    setWallets((prev) => ({ ...prev, courant: prev.courant - charge.amount }));
                    setShowChargesModal(false);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <span>{charge.icon} {charge.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{fmt(charge.amount)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Transaction */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 100,
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            width: '100%',
            background: '#1a1a2e',
            borderRadius: '20px 20px 0 0',
            padding: '24px 20px 32px',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Ajouter une transaction</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCustomType('income')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: customType === 'income' ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
                    background: customType === 'income' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                    color: customType === 'income' ? '#4ade80' : 'rgba(255,255,255,0.5)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  ↑ Revenu
                </button>
                <button
                  onClick={() => setCustomType('expense')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: customType === 'expense' ? '2px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
                    background: customType === 'expense' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)',
                    color: customType === 'expense' ? '#f87171' : 'rgba(255,255,255,0.5)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  ↓ Dépense
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Montant (F)</label>
              <input
                type="number"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Description</label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Ex: Courses au marché"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>

            <button
              onClick={customType === 'income' ? addIncome : addExpense}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: customType === 'income' ? '#4ade80' : '#f87171',
                color: '#fff',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
