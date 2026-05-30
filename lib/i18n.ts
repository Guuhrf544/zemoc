import { useSettings, type Language } from '@/lib/store/settings';

const STRINGS = {
  en: {
    // Tabs
    'tab.home': 'Home',
    'tab.subs': 'Subs',
    'tab.expenses': 'Expenses',
    'tab.income': 'Income',
    'tab.insights': 'Insights',

    // Home
    'home.title': 'Zemoc',
    'home.subtitle': 'Your financial dashboard',
    'home.balance.label': 'Balance this month',
    'home.balance.subtitle': '{month} · projected end-of-month',
    'home.balance.previous': 'Previous balance: {amount}',
    'home.stat.income': 'Income',
    'home.stat.spent': 'Spent',
    'home.stat.planned': 'Planned expenses',
    'home.upcoming': 'Upcoming charges',
    'home.seeAll': 'See all',
    'home.upcoming.empty': 'No subscriptions to track yet.',

    // Subscriptions screen
    'subs.title': 'Subscriptions',
    'subs.subtitle': 'Track what charges you every month',
    'subs.monthlyTotal': 'Monthly total',
    'subs.empty.title': 'No subscriptions yet',
    'subs.empty.message': 'Tap the "+" button to add your first subscription (Netflix, Spotify, gym…).',

    // Subscription form
    'subs.form.new': 'New subscription',
    'subs.form.edit': 'Edit subscription',
    'subs.form.name': 'Name',
    'subs.form.name.placeholder': 'e.g. Netflix',
    'subs.form.period': 'Billing period',
    'subs.form.period.monthly': 'Monthly',
    'subs.form.period.yearly': 'Yearly',
    'subs.form.amount.monthly': 'Monthly amount ({symbol})',
    'subs.form.amount.yearly': 'Yearly amount ({symbol})',
    'subs.form.day': 'Billing day',
    'subs.form.day.placeholder': 'e.g. 15',
    'subs.form.day.hint.monthly': "Day of the month when it's charged (1–31)",
    'subs.form.day.hint.yearly': 'Day of the month (1–31)',
    'subs.form.month': 'Billing month',
    'subs.form.month.placeholder': 'e.g. 3 (March)',
    'subs.form.month.hint': "Month of the year when it's charged (1–12)",
    'subs.form.category': 'Category',
    'subs.form.notes': 'Notes (optional)',
    'subs.form.notes.placeholder': 'Family plan, shared card…',

    // Expenses screen
    'expenses.title': 'Expenses',
    'expenses.subtitle': 'Your daily spending in a tap',
    'expenses.thisMonth': 'This month',
    'expenses.totalHint': '{actual} spent · {planned} planned',
    'expenses.byCategory': 'By category',
    'expenses.all': 'All expenses',
    'expenses.empty': 'Nothing here yet. Try "15 coffee" and pick a day below.',

    // Expense form
    'expenseForm.edit': 'Edit expense',
    'expenseForm.notFound': 'Expense not found.',
    'expenseForm.description': 'Description',
    'expenseForm.description.placeholder': 'e.g. grocery',
    'expenseForm.amount': 'Amount ({symbol})',
    'expenseForm.day': 'Day',
    'expenseForm.day.hint': 'Day of {month} (1–31)',

    // Income screen
    'income.title': 'Income',
    'income.subtitle': 'Everything coming in',
    'income.thisMonth': 'Income this month',
    'income.thisMonthIn': 'Income in {month}',
    'income.all': 'All income',
    'income.empty': 'Nothing here yet. Try "3000 salary" and pick a day below.',

    // Income form
    'incomeForm.new': 'New income',
    'incomeForm.edit': 'Edit income',
    'incomeForm.source': 'Source',
    'incomeForm.source.placeholder': 'e.g. Salary, Freelance',

    // Insights
    'insights.title': 'Insights',
    'insights.subtitle': 'Where you can save',
    'insights.empty.title': 'Nothing to analyze yet',
    'insights.empty.message': 'Add some subscriptions and expenses — Zemoc will highlight patterns and savings opportunities here.',
    'insights.topCategories': 'Top categories',
    'insights.thisMonthSoFar': 'This month so far',
    'insights.reviewSubs': 'Subscriptions to review',
    'insights.reviewSubs.hint': 'Cancelling these could save up to {monthly}/month',
    'insights.reviewSubs.hintYear': ' · {yearly}/year',
    'insights.tip': 'Tip',
    'insights.tip.subs': 'Subscriptions alone take {amount} every month. Review the list above — cutting {example}/month saves {exampleYear} a year.',
    'insights.tip.logMore': 'Log a few expenses each day to get a more accurate forecast.',

    // Forecast card
    'forecast.title': 'End-of-month forecast',
    'forecast.spentSoFar': 'Spent so far',
    'forecast.daysLeft': 'Days left',

    // Upcoming charges labels
    'upcoming.today': 'Today',
    'upcoming.tomorrow': 'Tomorrow',
    'upcoming.inDays': 'In {days} days',
    'upcoming.nextWeek': 'Next week',
    'upcoming.inMonths': 'In {months} months',

    // Badges
    'badge.planned': 'PLANNED',

    // Quick inputs
    'quick.expense.placeholder': 'e.g. "87 electricity"',
    'quick.expense.incomplete': 'Add an amount and a description (e.g. "15 coffee").',
    'quick.income.placeholder': 'e.g. "458 salary"',
    'quick.income.incomplete': 'Add an amount and a source (e.g. "3000 salary").',
    'quick.day': 'Day',
    'quick.day.placeholder': 'today',
    'quick.day.hint': 'empty = today',
    'quick.day.hintMonth': 'empty = today ({month})',

    // Month selector
    'month.tapToReset': 'tap to reset',
    'month.picker.title': 'Select month',
    'day.picker.title': 'Pick day',
    'day.picker.today': 'Today',
    'day.picker.clear': 'Clear',
    'day.picker.label.today': 'Today',

    // Common actions
    'common.add': 'Add',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.cancel': 'Cancel',
    'common.remove.message': 'Remove "{name}"?',
    'a11y.profile': 'Profile',
    'a11y.addSubscription': 'Add subscription',
    'a11y.addIncome': 'Add income',
    'a11y.close': 'Close',
    'a11y.deleteDigit': 'Delete',

    // Alerts
    'alert.name.title': 'Name required',
    'alert.name.subscription': 'Give this subscription a name (e.g. Netflix).',
    'alert.amount.title': 'Invalid amount',
    'alert.amount.msg': 'Enter an amount greater than zero.',
    'alert.day.title': 'Invalid day',
    'alert.day.msg': 'Enter a day between 1 and 31.',
    'alert.billingMonth.title': 'Invalid billing month',
    'alert.billingMonth.msg': 'Enter a month between 1 and 12.',
    'alert.source.title': 'Source required',
    'alert.source.msg': 'Give this income a source (e.g. Salary).',
    'alert.description.title': 'Description required',
    'alert.description.msg': 'Enter a description (e.g. grocery).',
    'alert.delete.subscription': 'Delete subscription',
    'alert.delete.expense': 'Delete expense',
    'alert.delete.income': 'Delete income',

    // Profile
    'profile.title': 'Profile',
    'profile.photo.add': 'Add photo',
    'profile.photo.change': 'Change photo',
    'profile.personalData': 'Personal data',
    'profile.name': 'Name',
    'profile.name.placeholder': 'Your name',
    'profile.settings': 'Settings',
    'profile.appSettings': 'App settings',
    'profile.alert.permission.title': 'Permission needed',
    'profile.alert.permission.msg': 'Allow photo access in Settings to upload your profile picture.',
    'profile.alert.nameRequired.msg': 'Enter your name.',

    // Settings
    'settings.title': 'Settings',
    'settings.preferences': 'Preferences',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.notifications.enable': 'Enable notifications',
    'settings.security': 'Security',
    'settings.security.pin': 'Require PIN',
    'settings.security.changePin': 'Change PIN',
    'settings.security.biometric': 'Biometric unlock',
    'settings.security.biometric.hint': 'Enable PIN first',
    'settings.data': 'Data',
    'settings.data.backup': 'Backup (JSON)',
    'settings.data.restore': 'Restore from backup',
    'settings.data.export': 'Export as CSV',
    'settings.icloud': 'iCloud',
    'settings.icloud.toggle': 'Sync with iCloud',
    'settings.icloud.toggleHint': 'Backup your data to iCloud and sync across your iOS devices.',
    'settings.icloud.lastSync': 'Last synced',
    'settings.icloud.neverSynced': 'Never',
    'settings.icloud.syncNow': 'Sync now',
    'settings.icloud.syncing': 'Syncing…',
    'settings.icloud.syncSuccess': 'Sync complete',
    'settings.icloud.syncFailed': 'Sync failed',
    'settings.icloud.unavailable.title': 'iCloud unavailable',
    'settings.icloud.unavailable.msg': 'Sign in to iCloud and enable iCloud Drive in iOS Settings.',
    'settings.icloud.cloudFound.title': 'Cloud data found',
    'settings.icloud.cloudFound.msg': 'Existing Zemoc data was found in your iCloud. What would you like to do?',
    'settings.icloud.cloudFound.useCloud': 'Use cloud data',
    'settings.icloud.cloudFound.useDevice': 'Use device data',
    'settings.about': 'About',
    'settings.about.version': 'Version',
    'settings.about.terms': 'Terms of use',
    'settings.about.privacy': 'Privacy policy',
    'settings.about.support': 'Contact & support',
    'settings.language.en': 'English',
    'settings.language.pt': 'Português',
    'settings.currency.EUR': 'Euro',
    'settings.currency.BRL': 'Brazilian real',
    'settings.currency.USD': 'US dollar',
    'settings.appearance.light': 'Light',
    'settings.appearance.dark': 'Dark',
    'settings.appearance.auto': 'Automatic',
    'settings.appearance.auto.hint': 'Follow system',
    'settings.export.failed': 'Export failed',
    'settings.export.failed.default': 'Something went wrong',
    'settings.about.noEmail': 'No email app',
    'settings.about.noEmailMsg': 'Couldn\'t open mail. Write to elogia.dev@gmail.com',

    // PIN
    'pin.setup.title': 'Create PIN',
    'pin.setup.step1': 'Enter a 4-digit PIN',
    'pin.setup.step2': 'Confirm your PIN',
    'pin.setup.mismatch': 'PINs do not match. Try again.',
    'pin.setup.saved': 'PIN saved',
    'pin.unlock.title': 'Enter your PIN',
    'pin.unlock.wrong': 'Wrong PIN',
    'pin.unlock.remaining': 'Wrong PIN — {remaining} attempts left',
    'pin.unlock.locked': 'Too many attempts. Try again in {seconds}s.',
    'pin.unlock.useBiometric': 'Use biometrics',
    'pin.change.current': 'Enter current PIN',
    'pin.change.success': 'PIN changed',
    'pin.disable.confirm': 'Disable PIN?',
    'pin.disable.confirmMsg': 'Your data will no longer be protected by a PIN.',
    'pin.disable.action': 'Disable',

    // Biometric
    'biometric.notAvailable': 'Biometrics not available',
    'biometric.notAvailableMsg': 'This device does not support biometrics or none are enrolled.',
    'biometric.requirePin.title': 'Enable PIN first',
    'biometric.requirePin.msg': 'Set up a PIN before enabling biometric unlock.',
    'biometric.prompt': 'Unlock Zemoc',

    // Backup / Restore
    'backup.success': 'Backup ready',
    'backup.successMsg': 'Your data was exported to a JSON file.',
    'backup.failed': 'Backup failed',
    'restore.confirm': 'Restore data?',
    'restore.confirmMsg': 'This will replace all current data with the backup contents. This cannot be undone.',
    'restore.action': 'Restore',
    'restore.success': 'Data restored',
    'restore.successMsg': 'Your backup was imported successfully.',
    'restore.failed': 'Restore failed',
    'restore.invalidFile': 'Invalid backup file.',

    // Terms / Privacy
    'terms.title': 'Terms of use',
    'privacy.title': 'Privacy policy',
    'legal.updated': 'Last updated: May 2026',
    'terms.s1.h': 'Acceptance',
    'terms.s1.p': `By using Zemoc ("the App"), you agree to these Terms of Use. If you do not agree, please do not use the App.`,
    'terms.s2.h': 'The service',
    'terms.s2.p': 'Zemoc is a personal finance tracker. All data you enter (expenses, incomes, subscriptions) is stored locally on your device. The App does not send your financial data to any server.',
    'terms.s3.h': 'Your responsibilities',
    'terms.s3.p': 'You are responsible for the accuracy of the data you enter and for keeping backups of your information. Deleting the App will delete all local data unless you have saved a backup.',
    'terms.s4.h': 'No financial advice',
    'terms.s4.p': 'Zemoc provides tools and summaries based on the data you enter. It does not provide financial, tax, legal, or investment advice. Decisions you make based on the App are your own responsibility.',
    'terms.s5.h': 'Limitation of liability',
    'terms.s5.p': `The App is provided "as is", without warranties of any kind. We are not liable for any loss of data or damages arising from the use of the App, to the extent permitted by law.`,
    'terms.s6.h': 'Changes',
    'terms.s6.p': 'We may update these Terms from time to time. Continued use of the App after changes means you accept the updated Terms.',
    'terms.s7.h': 'Contact',
    'terms.s7.p': 'Questions? Write to elogia.dev@gmail.com.',
    'privacy.s1.h': 'What we collect',
    'privacy.s1.p': `Zemoc is designed to be private by default. All financial data you enter — subscriptions, expenses, incomes, profile details — is stored locally on your device using the operating system's storage and secure keychain. We do not operate any server and do not have access to your financial data.`,
    'privacy.s2.h': 'iCloud sync (optional)',
    'privacy.s2.p': `If you enable "Sync with iCloud" in Settings, Zemoc stores a copy of your data inside your personal iCloud container. This lets you back up your data and sync it across your iOS devices. The data lives in your iCloud account and is processed by Apple under its terms. Zemoc and its developer do not have access to it. You can disable sync at any time in Settings; existing iCloud data can be removed from your device's iOS settings under iCloud Storage.`,
    'privacy.s3.h': 'Photos',
    'privacy.s3.p': 'If you add a profile photo, it is stored locally on your device only. We request photo library access solely for this purpose.',
    'privacy.s4.h': 'Biometrics and PIN',
    'privacy.s4.p': `If you enable PIN or biometric unlock, your PIN is stored using your device's secure keychain and never leaves your device — it is excluded from iCloud sync. Biometric verification is handled entirely by the operating system — Zemoc only receives a pass/fail result.`,
    'privacy.s5.h': 'Backups and exports',
    'privacy.s5.p': 'When you use the manual backup or export features, a file is generated on your device and you decide how to share or save it. Zemoc never uploads it automatically to any server we control.',
    'privacy.s6.h': 'Analytics and tracking',
    'privacy.s6.p': 'Zemoc does not use analytics SDKs, advertising SDKs, or third-party trackers.',
    'privacy.s7.h': 'Children',
    'privacy.s7.p': 'Zemoc is not directed to children under 13.',
    'privacy.s8.h': 'Contact',
    'privacy.s8.p': 'Privacy questions? Write to elogia.dev@gmail.com.',

    // Categories (expense)
    'category.Food': 'Food',
    'category.Transport': 'Transport',
    'category.Housing': 'Housing',
    'category.Entertainment': 'Entertainment',
    'category.Health': 'Health',
    'category.Education': 'Education',
    'category.Shopping': 'Shopping',
    'category.Subscriptions': 'Subscriptions',
    'category.Other': 'Other',

    // Income categories
    'incomeCategory.Salary': 'Salary',
    'incomeCategory.Freelance': 'Freelance',
    'incomeCategory.Bonus': 'Bonus',
    'incomeCategory.Investment': 'Investment',
    'incomeCategory.Gift': 'Gift',
    'incomeCategory.Refund': 'Refund',
    'incomeCategory.Other': 'Other',

    // Format helpers
    'format.day': 'day {day}',

    // Review subscription item
    'review.perYear': '{amount} per year',
    'review.perMonth': '/month',
    'review.perYearLabel': '/year',
  },
  pt: {
    // Tabs
    'tab.home': 'Início',
    'tab.subs': 'Assin.',
    'tab.expenses': 'Gastos',
    'tab.income': 'Receita',
    'tab.insights': 'Análise',

    // Home
    'home.title': 'Zemoc',
    'home.subtitle': 'Seu painel financeiro',
    'home.balance.label': 'Saldo deste mês',
    'home.balance.subtitle': '{month} · projeção de fim de mês',
    'home.balance.previous': 'Saldo anterior: {amount}',
    'home.stat.income': 'Receita',
    'home.stat.spent': 'Gasto',
    'home.stat.planned': 'Gastos previstos',
    'home.upcoming': 'Próximas cobranças',
    'home.seeAll': 'Ver tudo',
    'home.upcoming.empty': 'Nenhuma assinatura para acompanhar.',

    // Subscriptions screen
    'subs.title': 'Assinaturas',
    'subs.subtitle': 'Controle o que cobra todo mês',
    'subs.monthlyTotal': 'Total mensal',
    'subs.empty.title': 'Nenhuma assinatura ainda',
    'subs.empty.message': 'Toque em "+" para adicionar sua primeira assinatura (Netflix, Spotify, academia…).',

    // Subscription form
    'subs.form.new': 'Nova assinatura',
    'subs.form.edit': 'Editar assinatura',
    'subs.form.name': 'Nome',
    'subs.form.name.placeholder': 'ex. Netflix',
    'subs.form.period': 'Período de cobrança',
    'subs.form.period.monthly': 'Mensal',
    'subs.form.period.yearly': 'Anual',
    'subs.form.amount.monthly': 'Valor mensal ({symbol})',
    'subs.form.amount.yearly': 'Valor anual ({symbol})',
    'subs.form.day': 'Dia da cobrança',
    'subs.form.day.placeholder': 'ex. 15',
    'subs.form.day.hint.monthly': 'Dia do mês da cobrança (1–31)',
    'subs.form.day.hint.yearly': 'Dia do mês (1–31)',
    'subs.form.month': 'Mês da cobrança',
    'subs.form.month.placeholder': 'ex. 3 (Março)',
    'subs.form.month.hint': 'Mês do ano da cobrança (1–12)',
    'subs.form.category': 'Categoria',
    'subs.form.notes': 'Notas (opcional)',
    'subs.form.notes.placeholder': 'Plano família, cartão compartilhado…',

    // Expenses screen
    'expenses.title': 'Gastos',
    'expenses.subtitle': 'Seus gastos do dia a dia em um toque',
    'expenses.thisMonth': 'Este mês',
    'expenses.totalHint': '{actual} gasto · {planned} previsto',
    'expenses.byCategory': 'Por categoria',
    'expenses.all': 'Todos os gastos',
    'expenses.empty': 'Nada aqui ainda. Tente "15 café" e escolha um dia abaixo.',

    // Expense form
    'expenseForm.edit': 'Editar gasto',
    'expenseForm.notFound': 'Gasto não encontrado.',
    'expenseForm.description': 'Descrição',
    'expenseForm.description.placeholder': 'ex. mercado',
    'expenseForm.amount': 'Valor ({symbol})',
    'expenseForm.day': 'Dia',
    'expenseForm.day.hint': 'Dia de {month} (1–31)',

    // Income screen
    'income.title': 'Receita',
    'income.subtitle': 'Tudo o que entra',
    'income.thisMonth': 'Receita deste mês',
    'income.thisMonthIn': 'Receita em {month}',
    'income.all': 'Toda a receita',
    'income.empty': 'Nada aqui ainda. Tente "3000 salário" e escolha um dia abaixo.',

    // Income form
    'incomeForm.new': 'Nova receita',
    'incomeForm.edit': 'Editar receita',
    'incomeForm.source': 'Fonte',
    'incomeForm.source.placeholder': 'ex. Salário, Freelance',

    // Insights
    'insights.title': 'Análise',
    'insights.subtitle': 'Onde você pode economizar',
    'insights.empty.title': 'Nada para analisar ainda',
    'insights.empty.message': 'Adicione algumas assinaturas e gastos — o Zemoc vai destacar padrões e oportunidades de economia aqui.',
    'insights.topCategories': 'Categorias principais',
    'insights.thisMonthSoFar': 'Este mês até agora',
    'insights.reviewSubs': 'Assinaturas para revisar',
    'insights.reviewSubs.hint': 'Cancelar essas pode economizar até {monthly}/mês',
    'insights.reviewSubs.hintYear': ' · {yearly}/ano',
    'insights.tip': 'Dica',
    'insights.tip.subs': 'Só as assinaturas somam {amount} por mês. Revise a lista acima — cortar {example}/mês economiza {exampleYear} por ano.',
    'insights.tip.logMore': 'Registre alguns gastos por dia para ter uma previsão mais precisa.',

    // Forecast card
    'forecast.title': 'Previsão fim de mês',
    'forecast.spentSoFar': 'Gasto até agora',
    'forecast.daysLeft': 'Dias restantes',

    // Upcoming charges labels
    'upcoming.today': 'Hoje',
    'upcoming.tomorrow': 'Amanhã',
    'upcoming.inDays': 'Em {days} dias',
    'upcoming.nextWeek': 'Próxima semana',
    'upcoming.inMonths': 'Em {months} meses',

    // Badges
    'badge.planned': 'PREVISTO',

    // Quick inputs
    'quick.expense.placeholder': 'ex. "87 conta de luz"',
    'quick.expense.incomplete': 'Adicione um valor e uma descrição (ex. "15 café").',
    'quick.income.placeholder': 'ex. "458 salário"',
    'quick.income.incomplete': 'Adicione um valor e uma fonte (ex. "3000 salário").',
    'quick.day': 'Dia',
    'quick.day.placeholder': 'hoje',
    'quick.day.hint': 'vazio = hoje',
    'quick.day.hintMonth': 'vazio = hoje ({month})',

    // Month selector
    'month.tapToReset': 'tocar para resetar',
    'month.picker.title': 'Selecionar mês',
    'day.picker.title': 'Escolher dia',
    'day.picker.today': 'Hoje',
    'day.picker.clear': 'Limpar',
    'day.picker.label.today': 'Hoje',

    // Common actions
    'common.add': 'Adicionar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.cancel': 'Cancelar',
    'common.remove.message': 'Remover "{name}"?',
    'a11y.profile': 'Perfil',
    'a11y.addSubscription': 'Adicionar assinatura',
    'a11y.addIncome': 'Adicionar receita',
    'a11y.close': 'Fechar',
    'a11y.deleteDigit': 'Apagar',

    // Alerts
    'alert.name.title': 'Nome obrigatório',
    'alert.name.subscription': 'Dê um nome a essa assinatura (ex. Netflix).',
    'alert.amount.title': 'Valor inválido',
    'alert.amount.msg': 'Informe um valor maior que zero.',
    'alert.day.title': 'Dia inválido',
    'alert.day.msg': 'Informe um dia entre 1 e 31.',
    'alert.billingMonth.title': 'Mês de cobrança inválido',
    'alert.billingMonth.msg': 'Informe um mês entre 1 e 12.',
    'alert.source.title': 'Fonte obrigatória',
    'alert.source.msg': 'Dê uma fonte a essa receita (ex. Salário).',
    'alert.description.title': 'Descrição obrigatória',
    'alert.description.msg': 'Informe uma descrição (ex. mercado).',
    'alert.delete.subscription': 'Excluir assinatura',
    'alert.delete.expense': 'Excluir gasto',
    'alert.delete.income': 'Excluir receita',

    // Profile
    'profile.title': 'Perfil',
    'profile.photo.add': 'Adicionar foto',
    'profile.photo.change': 'Trocar foto',
    'profile.personalData': 'Dados pessoais',
    'profile.name': 'Nome',
    'profile.name.placeholder': 'Seu nome',
    'profile.settings': 'Configurações',
    'profile.appSettings': 'Configurações do app',
    'profile.alert.permission.title': 'Permissão necessária',
    'profile.alert.permission.msg': 'Permita acesso às fotos em Ajustes para enviar sua foto de perfil.',
    'profile.alert.nameRequired.msg': 'Informe seu nome.',

    // Settings
    'settings.title': 'Configurações',
    'settings.preferences': 'Preferências',
    'settings.language': 'Idioma',
    'settings.currency': 'Moeda',
    'settings.appearance': 'Aparência',
    'settings.notifications': 'Notificações',
    'settings.notifications.enable': 'Ativar notificações',
    'settings.security': 'Segurança',
    'settings.security.pin': 'Exigir PIN',
    'settings.security.changePin': 'Alterar PIN',
    'settings.security.biometric': 'Desbloqueio biométrico',
    'settings.security.biometric.hint': 'Ative o PIN primeiro',
    'settings.data': 'Dados',
    'settings.data.backup': 'Backup (JSON)',
    'settings.data.restore': 'Restaurar backup',
    'settings.data.export': 'Exportar como CSV',
    'settings.icloud': 'iCloud',
    'settings.icloud.toggle': 'Sincronizar com iCloud',
    'settings.icloud.toggleHint': 'Faça backup dos seus dados no iCloud e sincronize entre seus dispositivos iOS.',
    'settings.icloud.lastSync': 'Última sincronização',
    'settings.icloud.neverSynced': 'Nunca',
    'settings.icloud.syncNow': 'Sincronizar agora',
    'settings.icloud.syncing': 'Sincronizando…',
    'settings.icloud.syncSuccess': 'Sincronização concluída',
    'settings.icloud.syncFailed': 'Falha na sincronização',
    'settings.icloud.unavailable.title': 'iCloud indisponível',
    'settings.icloud.unavailable.msg': 'Entre no iCloud e ative o iCloud Drive nos Ajustes do iOS.',
    'settings.icloud.cloudFound.title': 'Dados na nuvem',
    'settings.icloud.cloudFound.msg': 'Encontramos dados do Zemoc no seu iCloud. O que deseja fazer?',
    'settings.icloud.cloudFound.useCloud': 'Usar dados da nuvem',
    'settings.icloud.cloudFound.useDevice': 'Usar dados do aparelho',
    'settings.about': 'Sobre',
    'settings.about.version': 'Versão',
    'settings.about.terms': 'Termos de uso',
    'settings.about.privacy': 'Política de privacidade',
    'settings.about.support': 'Contato e suporte',
    'settings.language.en': 'English',
    'settings.language.pt': 'Português',
    'settings.currency.EUR': 'Euro',
    'settings.currency.BRL': 'Real brasileiro',
    'settings.currency.USD': 'Dólar americano',
    'settings.appearance.light': 'Claro',
    'settings.appearance.dark': 'Escuro',
    'settings.appearance.auto': 'Automático',
    'settings.appearance.auto.hint': 'Seguir sistema',
    'settings.export.failed': 'Falha ao exportar',
    'settings.export.failed.default': 'Algo deu errado',
    'settings.about.noEmail': 'Sem app de e-mail',
    'settings.about.noEmailMsg': 'Não foi possível abrir o e-mail. Escreva para elogia.dev@gmail.com',

    // PIN
    'pin.setup.title': 'Criar PIN',
    'pin.setup.step1': 'Digite um PIN de 4 dígitos',
    'pin.setup.step2': 'Confirme o PIN',
    'pin.setup.mismatch': 'Os PINs não coincidem. Tente novamente.',
    'pin.setup.saved': 'PIN salvo',
    'pin.unlock.title': 'Digite seu PIN',
    'pin.unlock.wrong': 'PIN incorreto',
    'pin.unlock.remaining': 'PIN incorreto — {remaining} tentativas restantes',
    'pin.unlock.locked': 'Muitas tentativas. Tente em {seconds}s.',
    'pin.unlock.useBiometric': 'Usar biometria',
    'pin.change.current': 'Digite o PIN atual',
    'pin.change.success': 'PIN alterado',
    'pin.disable.confirm': 'Desativar PIN?',
    'pin.disable.confirmMsg': 'Seus dados não estarão mais protegidos por PIN.',
    'pin.disable.action': 'Desativar',

    // Biometric
    'biometric.notAvailable': 'Biometria indisponível',
    'biometric.notAvailableMsg': 'Este aparelho não tem biometria cadastrada ou suportada.',
    'biometric.requirePin.title': 'Ative o PIN primeiro',
    'biometric.requirePin.msg': 'Configure um PIN antes de ativar o desbloqueio biométrico.',
    'biometric.prompt': 'Desbloquear Zemoc',

    // Backup / Restore
    'backup.success': 'Backup pronto',
    'backup.successMsg': 'Seus dados foram exportados em um arquivo JSON.',
    'backup.failed': 'Falha no backup',
    'restore.confirm': 'Restaurar dados?',
    'restore.confirmMsg': 'Isso vai substituir todos os dados atuais pelo conteúdo do backup. Não dá pra desfazer.',
    'restore.action': 'Restaurar',
    'restore.success': 'Dados restaurados',
    'restore.successMsg': 'Seu backup foi importado com sucesso.',
    'restore.failed': 'Falha ao restaurar',
    'restore.invalidFile': 'Arquivo de backup inválido.',

    // Terms / Privacy
    'terms.title': 'Termos de uso',
    'privacy.title': 'Política de privacidade',
    'legal.updated': 'Última atualização: Maio de 2026',
    'terms.s1.h': 'Aceitação',
    'terms.s1.p': `Ao usar o Zemoc ("o Aplicativo"), você concorda com estes Termos de Uso. Se você não concorda, por favor, não utilize o Aplicativo.`,
    'terms.s2.h': 'O serviço',
    'terms.s2.p': 'O Zemoc é um aplicativo de controle financeiro pessoal. Todos os dados inseridos (gastos, receitas, assinaturas) são armazenados localmente no seu dispositivo. O Aplicativo não envia seus dados financeiros para nenhum servidor.',
    'terms.s3.h': 'Suas responsabilidades',
    'terms.s3.p': 'Você é responsável pela exatidão dos dados que insere e por manter backups das suas informações. Desinstalar o Aplicativo apagará todos os dados locais, a menos que você tenha salvo um backup.',
    'terms.s4.h': 'Sem aconselhamento financeiro',
    'terms.s4.p': 'O Zemoc fornece ferramentas e resumos com base nos dados que você insere. Ele não oferece aconselhamento financeiro, fiscal, legal ou de investimento. Decisões tomadas com base no Aplicativo são de sua inteira responsabilidade.',
    'terms.s5.h': 'Limitação de responsabilidade',
    'terms.s5.p': `O Aplicativo é fornecido "no estado em que se encontra", sem garantias de qualquer natureza. Não nos responsabilizamos por perda de dados ou danos decorrentes do uso do Aplicativo, na medida permitida pela lei.`,
    'terms.s6.h': 'Alterações',
    'terms.s6.p': 'Podemos atualizar estes Termos de tempos em tempos. O uso contínuo do Aplicativo após alterações significa que você aceita os Termos atualizados.',
    'terms.s7.h': 'Contato',
    'terms.s7.p': 'Dúvidas? Escreva para elogia.dev@gmail.com.',
    'privacy.s1.h': 'O que coletamos',
    'privacy.s1.p': 'O Zemoc foi desenhado para ser privado por padrão. Todos os dados financeiros que você insere — assinaturas, gastos, receitas, informações de perfil — são armazenados localmente no seu dispositivo, utilizando o armazenamento do sistema operacional e o keychain seguro. Não operamos servidor algum e não temos acesso aos seus dados financeiros.',
    'privacy.s2.h': 'Sincronização com iCloud (opcional)',
    'privacy.s2.p': `Se você ativar "Sincronizar com iCloud" nas Configurações, o Zemoc guarda uma cópia dos seus dados no seu container pessoal do iCloud. Isso permite fazer backup e sincronizar entre os seus aparelhos iOS. Os dados ficam na sua conta do iCloud e são processados pela Apple segundo os termos dela. O Zemoc e o desenvolvedor não têm acesso a eles. Você pode desativar a sincronização a qualquer momento nas Configurações; os dados existentes no iCloud podem ser removidos pelos Ajustes do iOS, em Armazenamento do iCloud.`,
    'privacy.s3.h': 'Fotos',
    'privacy.s3.p': 'Se você adicionar uma foto de perfil, ela fica armazenada apenas localmente no seu dispositivo. Solicitamos acesso à galeria exclusivamente para esse fim.',
    'privacy.s4.h': 'Biometria e PIN',
    'privacy.s4.p': 'Se você ativar PIN ou desbloqueio biométrico, o PIN é armazenado no Keychain do iOS e nunca sai do aparelho — fica de fora da sincronização com iCloud. A verificação biométrica é feita inteiramente pelo sistema operacional — o Zemoc recebe apenas um resultado de aprovado/rejeitado.',
    'privacy.s5.h': 'Backups e exportações',
    'privacy.s5.p': 'Quando você usa as funções de backup manual ou exportação, um arquivo é gerado no seu dispositivo e você decide como compartilhá-lo ou salvá-lo. O Zemoc nunca envia esse arquivo automaticamente para nenhum servidor nosso.',
    'privacy.s6.h': 'Análise e rastreamento',
    'privacy.s6.p': 'O Zemoc não utiliza SDKs de análise, SDKs de publicidade, nem rastreadores de terceiros.',
    'privacy.s7.h': 'Crianças',
    'privacy.s7.p': 'O Zemoc não é direcionado a crianças com menos de 13 anos.',
    'privacy.s8.h': 'Contato',
    'privacy.s8.p': 'Dúvidas sobre privacidade? Escreva para elogia.dev@gmail.com.',

    // Categories (expense)
    'category.Food': 'Alimentação',
    'category.Transport': 'Transporte',
    'category.Housing': 'Moradia',
    'category.Entertainment': 'Lazer',
    'category.Health': 'Saúde',
    'category.Education': 'Educação',
    'category.Shopping': 'Compras',
    'category.Subscriptions': 'Assinaturas',
    'category.Other': 'Outros',

    // Income categories
    'incomeCategory.Salary': 'Salário',
    'incomeCategory.Freelance': 'Freelance',
    'incomeCategory.Bonus': 'Bônus',
    'incomeCategory.Investment': 'Investimento',
    'incomeCategory.Gift': 'Presente',
    'incomeCategory.Refund': 'Reembolso',
    'incomeCategory.Other': 'Outros',

    // Format helpers
    'format.day': 'dia {day}',

    // Review subscription item
    'review.perYear': '{amount} por ano',
    'review.perMonth': '/mês',
    'review.perYearLabel': '/ano',
  },
} as const;

type StringKey = keyof typeof STRINGS.en;

const interpolate = (
  str: string,
  vars?: Record<string, string | number>
): string => {
  if (!vars) return str;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    str
  );
};

const getString = (
  lang: Language,
  key: string,
  vars?: Record<string, string | number>
): string => {
  const dict = STRINGS[lang] as Record<string, string>;
  const enDict = STRINGS.en as Record<string, string>;
  return interpolate(dict[key] ?? enDict[key] ?? key, vars);
};

export type TranslateFn = (key: StringKey, vars?: Record<string, string | number>) => string;

export function t(key: StringKey, vars?: Record<string, string | number>): string {
  const lang = useSettings.getState().settings.language;
  return getString(lang, key, vars);
}

export function useT(): TranslateFn {
  const settings = useSettings((s) => s.settings);
  return (key, vars) => getString(settings.language, key, vars);
}
