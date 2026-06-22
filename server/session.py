# ====================================================================================================
# @file: session.py
#
# Tracks per-viewer session state. Each connected client gets a Session object
# that stores their username and interaction history.
# ====================================================================================================

class ViewerSession:
    # ====================================================================================================
    # @brief: Stores state for a single viewer that connects
    # @attr username: viewer display name
    # @attr interaction_count: the count of this viewer's interaction
    # @attr total_donated: total donation from this viewer
    # @attr is_subscribed: is this viewer subscribed to evie or not
    # @attr gifts_sent: total gifts sent from this viewer
    # @attr likes_given: total likes given from this viewer 
    def __init__(self):
        self.username = None
        self.interaction_count = 0
        self.total_donated = 0
        self.is_subscribed = False
        self.gifts_sent = 0
        self.likes_given = 0

    # ====================================================================================================
    # @brief check if the viewer has a username or not
    # ====================================================================================================
    def has_username(self) -> bool:
        return self.username != None
    
    # ====================================================================================================
    # @brief increments the interaction counter
    # ====================================================================================================
    def record_interaction(self):
        self.interaction_count += 1

    # ====================================================================================================
    # @brief record the amount of given donation
    # ====================================================================================================
    def record_donation(self, amount: int):
        self.total_donated += amount
        self.interaction_count += 1

    # ====================================================================================================
    # @brief record every gifts sent
    # ====================================================================================================
    def record_gift(self):
        self.gifts_sent += 1
        self.interaction_count += 1

    # ====================================================================================================
    # @brief toggle subscription to true
    # ====================================================================================================
    def record_subscribe(self):
        self.is_subscribed = True
        self.interaction_count += 1

    # ====================================================================================================
    # @brief records a like given by the users
    # ====================================================================================================
    def record_like(self):
        self.likes_given += 1
        self.interaction_count += 1