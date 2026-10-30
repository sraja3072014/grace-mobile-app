// src/App.jsx
import { useState } from 'react';
import { useWeatherEngine } from './hooks/useWeatherEngine';
import { DEFAULT_CAMPUSES, INITIAL_USER_PROFILE } from './constants/churchDefaults';

// Common Components
import ParticleCanvas from './components/common/ParticleCanvas';
import TickerNotice from './components/common/TickerNotice';
import PullToRefresh from './components/common/PullToRefresh';

// Layout Components
import MobileHeader from './components/layout/MobileHeader';
import DynamicIslandDock from './components/layout/DynamicIslandDock';
import ChurchSpaceModal from './components/modals/ChurchSpaceModal';
import UserProfileDrawer from './components/layout/UserProfileDrawer';
import NavSubPopups from './components/layout/NavSubPopups';

// Modals
import MemberProfileModal from './components/modals/MemberProfileModal';
import QuickAttendanceModal from './components/modals/QuickAttendanceModal';
import FinanceEntryModal from './components/modals/FinanceEntryModal';
import { upsertMember } from './services/memberService';

// Pages
import OverviewTab from './pages/1_Overview/OverviewTab';
import MembersPage from './pages/2_People/MembersPage';
import VisitorsPage from './pages/2_People/VisitorsPage';
import MinistriesPage from './pages/2_People/MinistriesPage';
import FinancePage from './pages/3_ChurchLife/FinancePage';
import EventsPage from './pages/3_ChurchLife/EventsPage';
import ServicePlansPage from './pages/3_ChurchLife/ServicePlansPage';
import LiveStreamPage from './pages/4_Connect/LiveStreamPage';
import BroadcastPage from './pages/4_Connect/BroadcastPage';
import PrayerWallPage from './pages/4_Connect/PrayerWallPage';
import BiblePage from './pages/4_Connect/BiblePage';

export default function App() {
  const {
    isWeatherActive,
    isTimeActive,
    toggleWeatherMode,
    toggleTimeMode,
    selectedWeatherKey,
    handleSelectWeather,
    selectedTimeKey,
    handleSelectTime,
    currentTheme
  } = useWeatherEngine();

  // Navigation & Sub-Menu States
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);

  // Drawers Trigger States (Left Church Modal & Right User Drawer)
  const [isChurchHubOpen, setIsChurchHubOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Modals States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null);
  const [membersRefreshCount, setMembersRefreshCount] = useState(0);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);

  // App Data States
  const [branches, setBranches] = useState(DEFAULT_CAMPUSES);
  const [selectedBranch, setSelectedBranch] = useState(DEFAULT_CAMPUSES[0]);
  const userProfile = INITIAL_USER_PROFILE;
  const [financeType, setFinanceType] = useState('income');
  const [liveCheckins, setLiveCheckins] = useState(128);

  const handleOpenAddMember = (initialData = null) => {
    setSelectedMemberForEdit(initialData);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member) => {
    setSelectedMemberForEdit(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (memberData) => {
    try {
      await upsertMember(memberData);
      setMembersRefreshCount((count) => count + 1);
      alert('உறுப்பினர் விவரங்கள் சூப்பர்பேஸில் வெற்றிகரமாகச் சேமிக்கப்பட்டன!');
      return true;
    } catch (err) {
      alert(`சேமிப்பதில் தோல்வி: ${err.message}`);
      return false;
    }
  };

  const handleCreateBranch = () => {
    const name = window.prompt('Enter the campus or branch name to create or join:');
    const trimmedName = name?.trim();
    if (!trimmedName) return;

    const branch = {
      id: `branch-${Date.now()}`,
      name: trimmedName,
      code: 'GCC-NEW',
      city: 'New Campus',
      isHQ: false
    };
    setBranches((current) => [...current, branch]);
    setSelectedBranch(branch);
    setIsChurchHubOpen(false);
  };

  // Dynamic Island Action Handler
  const handleTriggerAction = (actionId) => {
    if (actionId === 'action_checkin') {
      setIsAttendanceModalOpen(true);
    } else if (actionId === 'action_tithe') {
      setFinanceType('income');
      setIsFinanceModalOpen(true);
    } else if (actionId === 'action_add_member') {
      handleOpenAddMember();
    } else if (actionId === 'action_service_flow') {
      alert('Sunday Stage Service Flow opened');
    }
  };

  const handleGlobalRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  return (
    <PullToRefresh onRefresh={handleGlobalRefresh} theme={currentTheme}>
      <div 
        className="min-h-screen pb-36 relative overflow-x-hidden font-sans transition-all duration-1000 select-none"
        style={{
          backgroundImage: currentTheme?.bgGrad || 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e1b4b 100%)',
          backgroundAttachment: 'fixed',
          color: currentTheme?.textMain || '#ffffff'
        }}
      >
        {/* 1. Background Particle Engine */}
        <ParticleCanvas particleType={currentTheme?.particleType || 'stars'} />

        {/* 2. Top Header Bar */}
        <MobileHeader 
          selectedBranch={selectedBranch}
          isChurchModalOpen={isChurchHubOpen}
          setIsChurchModalOpen={setIsChurchHubOpen}
          theme={currentTheme}
          userProfile={userProfile}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
        />

        {/* 3. Church Space Modal */}
        <ChurchSpaceModal
          isOpen={isChurchHubOpen}
          onClose={() => setIsChurchHubOpen(false)}
          branches={branches}
          selectedBranch={selectedBranch}
          onSelectBranch={(branch) => {
            setSelectedBranch(branch);
            setIsChurchHubOpen(false);
          }}
          onCreateBranch={handleCreateBranch}
          theme={currentTheme}
        />

        {/* 4. User Profile & Settings Drawer */}
        <UserProfileDrawer
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
          userProfile={userProfile}
          theme={currentTheme}
          isWeatherActive={isWeatherActive}
          isTimeActive={isTimeActive}
          toggleWeatherMode={toggleWeatherMode}
          toggleTimeMode={toggleTimeMode}
          selectedWeatherKey={selectedWeatherKey}
          handleSelectWeather={handleSelectWeather}
          selectedTimeKey={selectedTimeKey}
          handleSelectTime={handleSelectTime}
        />

        {/* 5. Marquee Notice Ticker */}
        <TickerNotice theme={currentTheme} />

        {/* 6. Main Content Area */}
        <main className="relative z-10 max-w-lg mx-auto px-5 pt-4 space-y-4">
          {activeTab === 'home' && (
            <OverviewTab 
              theme={currentTheme}
              userProfile={userProfile}
              liveCheckins={liveCheckins}
              onOpenAttendance={() => setIsAttendanceModalOpen(true)}
              onOpenMembers={() => setActiveTab('members')}
              onOpenFinance={() => {
                setFinanceType('income');
                setIsFinanceModalOpen(true);
              }}
            />
          )}

          {activeTab === 'members' && (
            <MembersPage 
              theme={currentTheme} 
              onAddNewMember={handleOpenAddMember}
              onEditMember={handleOpenEditMember}
              refreshTrigger={membersRefreshCount}
            />
          )}

          {activeTab === 'visitors' && <VisitorsPage theme={currentTheme} />}
          {activeTab === 'ministries' && <MinistriesPage theme={currentTheme} />}
          {activeTab === 'finance' && (
            <FinancePage 
              theme={currentTheme}
              onRecordTransaction={(type) => {
                setFinanceType(type);
                setIsFinanceModalOpen(true);
              }}
            />
          )}
          {activeTab === 'events' && <EventsPage theme={currentTheme} />}
          {activeTab === 'service_plans' && <ServicePlansPage theme={currentTheme} />}
          {activeTab === 'livestream' && <LiveStreamPage theme={currentTheme} />}
          {activeTab === 'broadcast' && <BroadcastPage theme={currentTheme} />}
          {activeTab === 'prayer' && <PrayerWallPage theme={currentTheme} />}
          {activeTab === 'bible' && <BiblePage theme={currentTheme} />}
        </main>

        {/* 7. Sub-Menu Popup */}
        <NavSubPopups 
          activeSubMenu={activeSubMenu}
          onClose={() => setActiveSubMenu(null)}
          onSelectSubItem={(subId) => {
            setActiveTab(subId);
            setActiveSubMenu(null);
          }}
          theme={currentTheme}
        />

        {/* 8. Bottom Navigation Dynamic Island Dock */}
        <DynamicIslandDock 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeSubMenu={activeSubMenu}
          setActiveSubMenu={setActiveSubMenu}
          isIslandExpanded={isIslandExpanded}
          setIsIslandExpanded={setIsIslandExpanded}
          onTriggerAction={handleTriggerAction}
          theme={currentTheme}
        />

        {/* 9. Standalone Modals */}
        <MemberProfileModal 
          isOpen={isMemberModalOpen}
          onClose={() => {
            setIsMemberModalOpen(false);
            setSelectedMemberForEdit(null);
          }}
          initialData={selectedMemberForEdit}
          onSaveMember={handleSaveMember}
          theme={currentTheme}
        />

        <QuickAttendanceModal 
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          onMarkAttendance={() => setLiveCheckins(prev => prev + 1)}
          theme={currentTheme}
        />

        <FinanceEntryModal 
          isOpen={isFinanceModalOpen}
          onClose={() => setIsFinanceModalOpen(false)}
          initialType={financeType}
          onAddTransaction={(tx) => alert(`Recorded: ${tx.title} (${tx.amount})`)}
          theme={currentTheme}
        />

      </div>
    </PullToRefresh>
  );
}